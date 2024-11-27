import OpenAI from "openai";
import { Task, FileProcessingError } from "./types";
import { EXTRACT_TASKS_PROMPT } from "./llmPrompts";

function extractTaskObjects(responseText: string): Task[] {
  try {
    // Replace 'description:' with 'title:' before processing
    responseText = responseText.replace(/description:/g, "title:");

    // Find all JSON-like objects in curly braces
    const matches = responseText.match(/{[^{}]+}/g);
    if (!matches) {
      throw new Error("No task objects found in response");
    }

    // Parse each match into a Task object
    const tasks = matches
      .map((match) => {
        console.log("Raw match:", match);
        try {
          // No need for replacement since the JSON is already properly formatted
          const parsed = JSON.parse(match);

          // Log the parsed object to see what we're working with
          console.log("Parsed object:", parsed);

          return {
            title: parsed.title,
            dueDate: parsed.dueDate, // Notice this changed from "due date"
            notes: parsed.notes,
          };
        } catch (err) {
          console.error("Failed to parse task object:", match, "Error:", err);
          return null;
        }
      })
      .filter((task): task is Task => task !== null);

    if (tasks.length === 0) {
      throw new Error("No valid tasks could be parsed from response");
    }

    return tasks;
  } catch (error) {
    throw new FileProcessingError(
      `Failed to parse tasks from response: ${error instanceof Error ? error.message : String(error)}`,
      "EXTRACTION_FAILED"
    );
  }
}

// Initialize OpenAI client with better error handling
function createOpenAIClient(): OpenAI {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new FileProcessingError(
      "OpenAI API key not found in environment variables",
      "API_KEY_MISSING"
    );
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: false,
  });
}

const client = createOpenAIClient();

export async function processFileForTasks(file: {
  data: Uint8Array;
  name: string;
  type: string;
}): Promise<Task[]> {
  console.log(`Starting to process file: ${file.name}`);
  let fileId: string | undefined,
    vectorStoreId: string | undefined,
    assistantId: string | undefined,
    threadId: string | undefined;

  try {
    // 1. Upload file
    console.log("Uploading file to OpenAI...");
    const blob = new Blob([file.data], { type: file.type });
    const fileObject = new File([blob], file.name, { type: file.type });

    const uploadedFile = await client.files
      .create({
        file: fileObject,
        purpose: "assistants",
      })
      .catch((error) => {
        console.error("File upload failed:", error);
        throw new FileProcessingError(
          `Failed to upload file: ${error.message}`,
          "UPLOAD_FAILED"
        );
      });
    console.log("File object details:", {
      size: fileObject.size,
      type: fileObject.type,
      name: fileObject.name,
    });

    // 2. Create vector store and check file processing
    console.log("Creating vector store...");
    const vectorStore = await client.beta.vectorStores.create({
      name: `temp-store-${Date.now()}`,
      file_ids: [uploadedFile.id],
      expires_after: {
        anchor: "last_active_at",
        days: 1,
      },
    });
    vectorStoreId = vectorStore.id;
    console.log(`Vector store created. ID: ${vectorStoreId}`);
    console.log(
      "Vector store details:",
      await client.beta.vectorStores.retrieve(vectorStoreId)
    );

    // Check file processing status
    let attempts = 0;
    while (attempts < 10) {
      const vectorStoreStatus =
        await client.beta.vectorStores.retrieve(vectorStoreId);
      console.log("Vector store status:", vectorStoreStatus.file_counts);

      if (
        vectorStoreStatus.file_counts.in_progress === 0 &&
        vectorStoreStatus.file_counts.completed > 0
      ) {
        console.log("File processing completed");
        break;
      }

      if (vectorStoreStatus.file_counts.failed > 0) {
        throw new FileProcessingError(
          "File processing failed in vector store",
          "PROCESSING_FAILED"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= 10) {
      throw new FileProcessingError(
        "Timeout waiting for file processing",
        "PROCESSING_FAILED"
      );
    }

    // 3. Create assistant
    console.log("Creating assistant...");
    const assistant = await client.beta.assistants
      .create({
        name: "Task Extractor",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id],
          },
        },
      })
      .catch((error) => {
        console.error("Assistant creation failed:", error);
        throw new FileProcessingError(
          `Failed to create assistant: ${error.message}`,
          "PROCESSING_FAILED"
        );
      });
    assistantId = assistant.id;
    console.log(`Assistant created. ID: ${assistantId}`);
    console.log("Assistant configuration:", {
      tools: assistant.tools,
      tool_resources: assistant.tool_resources,
    });
    console.log(
      "Assistant details:",
      await client.beta.assistants.retrieve(assistant.id)
    );

    // 4. Create thread and run
    console.log("Creating thread and starting analysis...");
    const thread = await client.beta.threads.create();
    threadId = thread.id;
    console.log(`Thread created. ID: ${threadId}`);

    // Add initial message to thread
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: EXTRACT_TASKS_PROMPT,
    });

    console.log(
      "Thread messages:",
      await client.beta.threads.messages.list(thread.id)
    );

    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    console.log(`Analysis started. Run ID: ${run.id}`);

    // 5. Get results
    console.log("Waiting for analysis completion...");
    const tasks = await waitForRunCompletion(thread.id, run.id);
    console.log(`Analysis complete. Found ${tasks.length} tasks.`);
    return tasks;
  } catch (error) {
    if (error instanceof FileProcessingError) {
      throw error;
    }
    throw new FileProcessingError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      "PROCESSING_FAILED"
    );
  } finally {
    console.log("Starting cleanup...");
    await cleanup(fileId, vectorStoreId, assistantId, threadId);
    console.log("Cleanup complete");
  }
}

async function waitForRunCompletion(
  threadId: string,
  runId: string
): Promise<Task[]> {
  try {
    let run;
    let attempts = 0;
    do {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await client.beta.threads.runs.retrieve(threadId, runId);
      console.log(`Run status check #${attempts}: ${run.status}`);
    } while (run.status === "in_progress" || run.status === "queued");

    const runDetails = await client.beta.threads.runs.retrieve(threadId, runId);
    console.log("Run details:", runDetails);
    const steps = await client.beta.threads.runs.steps.list(threadId, runId);
    console.log("Run steps:", steps.data);
    console.log("Run steps:", steps);

    if (run.status !== "completed") {
      throw new FileProcessingError(
        `Run failed with status: ${run.status}`,
        "EXTRACTION_FAILED"
      );
    }

    const messages = await client.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    if (lastMessage.content[0].type !== "text") {
      throw new FileProcessingError(
        "Expected text content in response",
        "EXTRACTION_FAILED"
      );
    }

    const content = lastMessage.content[0].text.value;
    console.log("Raw AI response:", content);

    // Extract and parse tasks
    const tasks = extractTaskObjects(content);
    console.log("Parsed tasks:", tasks);

    return tasks;
  } catch (error) {
    if (error instanceof FileProcessingError) {
      throw error;
    }
    throw new FileProcessingError(
      `Error during run completion: ${error instanceof Error ? error.message : String(error)}`,
      "EXTRACTION_FAILED"
    );
  }
}

async function cleanup(
  fileId?: string,
  vectorStoreId?: string,
  assistantId?: string,
  threadId?: string
): Promise<void> {
  try {
    const cleanupPromises: Promise<any>[] = [];

    if (threadId) {
      cleanupPromises.push(client.beta.threads.del(threadId));
    }
    if (assistantId) {
      cleanupPromises.push(client.beta.assistants.del(assistantId));
    }
    if (vectorStoreId) {
      cleanupPromises.push(client.beta.vectorStores.del(vectorStoreId));
    }
    if (fileId) {
      cleanupPromises.push(client.files.del(fileId));
    }

    await Promise.all(cleanupPromises);
  } catch (error) {
    console.error("Error during cleanup:", error);
    // Don't throw here as it might mask the original error
  }
}
