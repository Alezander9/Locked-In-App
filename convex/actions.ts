import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { processFileForTasks } from "./llm";
import { Task, FileProcessingError } from "./types";
// Supported file types
const VALID_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

type ValidFileType = (typeof VALID_FILE_TYPES)[number];

export const internalProcessFile = internalAction({
  args: {
    fileData: v.string(),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args): Promise<Task[]> => {
    const binaryData = Uint8Array.from(atob(args.fileData), (c) =>
      c.charCodeAt(0)
    );

    return processFileForTasks({
      data: binaryData,
      name: args.fileName,
      type: args.fileType,
    });
  },
});

export const processFileAndExtractTasks = action({
  args: {
    fileData: v.string(),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args): Promise<Task[]> => {
    // Add logging to debug file size
    console.log("Received data length:", args.fileData.length);
    console.log("File name:", args.fileName);
    console.log("File type:", args.fileType);

    // Size calculation logging
    const sizeInBytes =
      (args.fileData.length * 3) / 4 -
      (args.fileData.match(/=+$/)?.[0]?.length || 0);
    console.log("Calculated size in bytes:", sizeInBytes);
    console.log("Size in MB:", sizeInBytes / (1024 * 1024));

    // Type validation
    if (!VALID_FILE_TYPES.includes(args.fileType as ValidFileType)) {
      throw new FileProcessingError(
        "Unsupported file type",
        "INVALID_FILE_TYPE"
      );
    }

    // Size validation (10MB limit)
    if (sizeInBytes > 10 * 1024 * 1024) {
      console.log("File size exceeds limit - throwing error");
      throw new FileProcessingError(
        "File too large (max 10MB)",
        "FILE_TOO_LARGE"
      );
    }

    try {
      return await ctx.runAction(internal.actions.internalProcessFile, {
        fileData: args.fileData,
        fileName: args.fileName,
        fileType: args.fileType,
      });
    } catch (error) {
      if (error instanceof FileProcessingError) {
        throw error;
      }
      throw new FileProcessingError(
        `Failed to process file: ${error instanceof Error ? error.message : String(error)}`,
        "PROCESSING_FAILED"
      );
    }
  },
});

// import { ChatCompletionMessageParam, chat } from "./llm";

// export const internalRequestAIResponse = internalAction({
//   args: {
//     prompt: v.string(),
//   },
//   handler: async (_ctx, args) => {
//     // Get the OpenAI API key from the environment
//     const openAIKey = process.env.LLM_API_KEY;
//     if (!openAIKey) {
//       throw new Error("LLM_API_KEY is not set in the environment");
//     }

//     // Prepare the messages array for the chat
//     const messages: ChatCompletionMessageParam[] = [
//       { role: "user", content: args.prompt },
//     ];

//     try {
//       // Use the chatStream function from llm.ts
//       const response = await chat(messages, openAIKey);
//       console.log(`sending respose ${response}`);
//       return response;
//     } catch (error) {
//       console.error("Error generating AI response:", error);
//       throw new Error(
//         `Error generating AI response: ${(error as Error).message}`
//       );
//     }
//   },
// });

// type AIResponse = string;

// export const clientRequestAIResponse = action({
//   args: { prompt: v.string() },
//   handler: async (
//     ctx: ActionCtx,
//     args: { prompt: string }
//   ): Promise<AIResponse> => {
//     // Add any necessary validation or preprocessing here
//     const response = await ctx.runAction(
//       internal.actions.internalRequestAIResponse,
//       args
//     );
//     return response;
//   },
// });
