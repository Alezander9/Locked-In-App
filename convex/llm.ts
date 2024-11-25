export const CONFIG = {
  url: "https://api.openai.com",
  chatModel: "gpt-4o-mini",
  embeddingModel: "text-embedding-ada-002", // dim 1536
};

export const completions = completionsViaFetch(CONFIG);
export const { chat, chatStream } = simpleCompletionsAPI(
  completions,
  CONFIG.chatModel
);

export type SimpleCompletionsAPI = {
  /**
   * Simple non-streaming interface to LLM chat completions.
   * @param messages The messages like you'd pass to OpenAI's .chat.completions.create
   * @param LLM_KEY The API key for authentication
   * @returns A string of the chat completion.
   */
  chat: (
    messages: ChatCompletionMessageParam[],
    LLM_KEY: string
  ) => Promise<string>;
  /**
   * Simple streaming interface to LLM chat completions.
   * @param messages The messages like you'd pass to OpenAI's .chat.completions.create
   * @param LLM_KEY The API key for authentication
   * @returns An async iterable of strings, each a part of the chat completion.
   */
  chatStream: (
    messages: ChatCompletionMessageParam[],
    LLM_KEY: string
  ) => Promise<AsyncIterable<string>>;
};

export const embeddings = embeddingsViaFetch(CONFIG);
export const { embed, embedBatch } = simpleEmbeddingsAPI(
  embeddings,
  CONFIG.embeddingModel
);
export type SimpleEmbeddingsAPI = {
  /**
   * Simple API to get an embedding for a single text.
   * @param text The text to create an embedding for
   * @param LLM_KEY The API key for authentication
   * @returns An array of numbers representing the embedding
   */
  embed: (text: string, LLM_KEY: string) => Promise<Array<number>>;
  /**
   * Simple API to get embeddings for multiple texts in batch.
   * @param texts An array of texts to create embeddings for.
   * @param LLM_KEY The API key for authentication
   * @returns An array of embeddings (array of numbers), in the order of the input texts.
   */
  embedBatch: (
    texts: string[],
    LLM_KEY: string
  ) => Promise<Array<Array<number>>>;
};

/**
 * Completions API
 */

/**
 * Makes a completions API using fetch, like OpenAI's .chat.completions.
 * @param config Specifies the URL of the LLM server
 * @returns Object with `create`: equivalent to OpenAI's `.chat.completions`
 */
export function completionsViaFetch(config: { url: string }) {
  return {
    async create(body: Record<string, any>, LLM_KEY: string) {
      const response = await retryWithBackoff(async () => {
        const response = await fetch(config.url + "/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + LLM_KEY,
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const error = await response.text();
          console.error({ error });
          throw {
            retry: shouldRetry(response),
            error: new Error(
              `Chat completion failed with code ${response.status}: ${error}`
            ),
          };
        }
        return response;
      });
      if (!body.stream) {
        const json = (await response.json()) as ChatCompletion;
        if (json.choices[0].message?.content === undefined) {
          throw new Error(
            "Unexpected result from OpenAI: " + JSON.stringify(json)
          );
        }
        return json;
      }
      const stream = response.body;
      if (!stream) throw new Error("No body in response");
      return {
        [Symbol.asyncIterator]: async function* () {
          for await (const data of splitStream(stream)) {
            if (data.startsWith("data:")) {
              const json = data.substring("data:".length).trimStart();
              if (json.startsWith("[DONE]")) {
                return;
              }
              yield JSON.parse(json);
            } else {
              console.debug("Unexpected data:", data);
            }
          }
        },
      };
    },
  } as CompletionsAPI;
}

async function* splitStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  let lastFragment = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Flush the last fragment now that we're done
        if (lastFragment !== "") {
          yield lastFragment;
        }
        break;
      }
      const data = new TextDecoder().decode(value);
      lastFragment += data;
      const parts = lastFragment.split("\n\n");
      // Yield all except for the last part
      for (let i = 0; i < parts.length - 1; i += 1) {
        yield parts[i];
      }
      // Save the last part as the new last fragment
      lastFragment = parts[parts.length - 1];
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 *
 * @param api Equivalent of OpenAI's .chat.completions or completionsViaFetch(CONFIG)
 * @param model The model name, like "gpt-4" or "llama3"
 * @returns Two functions: `chat` and `chatStream`, with simple interfaces.
 */
export function simpleCompletionsAPI(
  api: CompletionsAPI, // completionsViaFetch(CONFIG) or (new OpenA().chat.completions)
  model: string
): SimpleCompletionsAPI {
  return {
    chat: async (
      messages: ChatCompletionMessageParam[],
      LLM_KEY: string
    ): Promise<string> => {
      const response = await api.create(
        {
          model,
          messages,
          stream: false,
        },
        LLM_KEY
      );
      if (!response.choices[0].message?.content) {
        throw new Error(
          "Unexpected result from OpenAI: " + JSON.stringify(response)
        );
      }
      return response.choices[0].message.content;
    },
    chatStream: async (
      messages: ChatCompletionMessageParam[],
      LLM_KEY: string
    ): Promise<AsyncIterable<string>> => {
      const response = await api.create(
        {
          model,
          messages,
          stream: true,
        },
        LLM_KEY
      );
      return {
        async *[Symbol.asyncIterator]() {
          for await (const chunk of response) {
            if (chunk.choices[0].delta?.content) {
              yield chunk.choices[0].delta.content;
            }
          }
        },
      };
    },
  };
}

/**
 * Embeddings
 */

export function embeddingsViaFetch(config: { url: string }): EmbeddingsAPI {
  return {
    create: async (body) => {
      const json = await retryWithBackoff(async () => {
        const result = await fetch(config.url + "/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "my key",
          },
          body: JSON.stringify(body),
        });
        if (!result.ok) {
          throw {
            retry: shouldRetry(result),
            error: new Error(
              `Embedding failed with code ${result.status}: ${await result.text()}`
            ),
          };
        }
        return (await result.json()) as CreateEmbeddingResponse;
      });
      return json;
    },
  };
}

export function simpleEmbeddingsAPI(
  // either embeddingsViaFetch or (new OpenAI().embeddings)
  api: EmbeddingsAPI,
  model: string
): SimpleEmbeddingsAPI {
  return {
    embed: async (text: string): Promise<Array<number>> => {
      const json = await api.create({
        input: text,
        model,
      });
      return json.data[0].embedding;
    },
    embedBatch: async (texts: string[]): Promise<Array<Array<number>>> => {
      const json = await api.create({
        input: texts,
        model,
      });
      const allembeddings = json.data;
      allembeddings.sort((a, b) => a.index - b.index);
      return allembeddings.map(({ embedding }) => embedding);
    },
  };
}

/**
 * Helpers
 */

function shouldRetry(response: Response) {
  return (
    response.headers.get("x-should-retry") !== "false" &&
    (response.headers.get("x-should-retry") === "true" ||
      response.status === 408 || // Timeout
      response.status === 409 || // Lock timeout
      response.status === 429 || // Rate limit
      response.status >= 500) // Internal server error
  );
}

// Retry after this much time, based on the retry number.
const RETRY_BACKOFF = [1000, 10000, 20000]; // In ms
const RETRY_JITTER = 100; // In ms
type RetryError = { retry: boolean; error: any };
// Retry a function with exponential backoff.
export async function retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
  let i = 0;
  for (; i <= RETRY_BACKOFF.length; i++) {
    try {
      const start = Date.now();
      const result = await fn();
      const ms = Date.now() - start;
      if (i > 0) console.log(`Attempt ${i + 1} succeeded in ${ms}ms`);
      return result;
    } catch (e) {
      const retryError = e as RetryError;
      if (i < RETRY_BACKOFF.length) {
        if (retryError.retry) {
          console.log(
            `Attempt ${i + 1} failed, waiting ${RETRY_BACKOFF[i]}ms to retry...`,
            Date.now()
          );
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_BACKOFF[i] + RETRY_JITTER * Math.random())
          );
          continue;
        }
      }
      if (retryError.error) throw retryError.error;
      else throw e;
    }
  }
  throw new Error("Unreachable");
}

/**
 * Types to use as our API. Simplified from the OpenAI API.
 */

export interface CompletionsAPI {
  /**
   * Creates a model response for the given chat conversation.
   */
  create(
    body: ChatCompletionCreateParamsNonStreaming,
    LLM_KEY: string
  ): Promise<ChatCompletion>;
  create(
    body: ChatCompletionCreateParamsStreaming,
    LLM_KEY: string
  ): Promise<AsyncIterable<ChatCompletionChunk>>;
}

export interface ChatCompletion {
  id: string;
  choices: Array<{
    finish_reason:
      | "stop"
      | "length"
      | "tool_calls"
      | "content_filter"
      | "function_call";
    index: number;
    logprobs: {
      content: Array<ChatCompletionTokenLogprob> | null;
    } | null;
    message: {
      content: string | null;
      role: "assistant";
      /** @deprecated Deprecated and replaced by `tool_calls` */
      function_call?: {
        arguments: string;
        name: string;
      };
      tool_calls?: Array<ChatCompletionMessageToolCall>;
    };
  }>;
  created: number;
  model: string;
  object: "chat.completion";
  system_fingerprint?: string;
  usage?: CompletionUsage;
}

export interface ChatCompletionChunk {
  id: string;
  choices: Array<{
    delta: {
      content?: string | null;
      /** @deprecated: Deprecated and replaced by `tool_calls`. The name and arguments of */
      function_call?: { arguments?: string; name?: string };
      role?: "system" | "user" | "assistant" | "tool";
      tool_calls?: Array<{
        index: number;
        id?: string;
        function?: {
          arguments?: string;
          name?: string;
        };
        type?: "function";
      }>;
    };
    finish_reason:
      | "stop"
      | "length"
      | "tool_calls"
      | "content_filter"
      | "function_call"
      | null;
    index: number;
    logprobs?: { content: Array<ChatCompletionTokenLogprob> | null } | null;
  }>;
  created: number;
  model: string;
  object: "chat.completion.chunk";
  system_fingerprint?: string;
  usage?: CompletionUsage;
}

export interface CompletionUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface ChatCompletionMessageToolCall {
  id: string;
  function: {
    arguments: string;
    name: string;
  };
  type: "function";
}

export interface ChatCompletionTokenLogprob {
  token: string;
  bytes: Array<number> | null;
  logprob: number;
  top_logprobs: Array<{
    token: string;
    bytes: Array<number> | null;
    logprob: number;
  }>;
}

export type ChatCompletionCreateParams =
  | ChatCompletionCreateParamsNonStreaming
  | ChatCompletionCreateParamsStreaming;

export interface ChatCompletionCreateParamsBase {
  messages: Array<ChatCompletionMessageParam>;
  model: string;
  frequency_penalty?: number | null;
  /** @deprecated in favor of `tools`. */
  functions?: Array<{
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  }>;
  logit_bias?: Record<string, number> | null;
  logprobs?: boolean | null;
  max_tokens?: number | null;
  n?: number | null;
  presence_penalty?: number | null;
  response_format?: { type?: "text" | "json_object" };
  seed?: number | null;
  stop?: string | null | Array<string>;
  stream?: boolean | null;
  stream_options?: {
    include_usage?: boolean;
  } | null;
  temperature?: number | null;
  tool_choice?:
    | "none" // the model will not call any tool and instead generates a message.
    | "auto" // the model can pick between generating a message or calling one or more tools.
    | "required" // the model must call one or more tools.
    | { function: { name: string }; type: "function" }; // forces the tool.
  tools?: Array<{
    function: {
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    };
    type: "function";
  }>;
  top_logprobs?: number | null;
  top_p?: number | null;
  user?: string;
}

export type ChatCompletionMessageParam =
  | {
      role: "system";
      content: string;
      name?: string;
    }
  | {
      role: "user";
      content:
        | string
        | Array<
            | {
                text: string;
                type: "text";
              }
            | {
                image_url: { url: string; detail?: "auto" | "low" | "high" };
                type: "image_url";
              }
          >;
      name?: string;
    }
  | {
      role: "assistant";
      content?: string | null;
      name?: string;
      tool_calls?: Array<ChatCompletionMessageToolCall>;
    }
  | {
      content: string;
      role: "tool";
      tool_call_id: string;
    };

export interface ChatCompletionCreateParamsNonStreaming
  extends ChatCompletionCreateParamsBase {
  stream?: false | null;
}
export interface ChatCompletionCreateParamsStreaming
  extends ChatCompletionCreateParamsBase {
  stream: true;
}

/** Embeddings */
export interface EmbeddingsAPI {
  /**
   * Creates an embedding vector representing the input text.
   */
  create(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
}

export interface CreateEmbeddingResponse {
  data: Array<Embedding>;
  model: string;
  object: "list";
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface Embedding {
  embedding: Array<number>;
  index: number;
  object: "embedding";
}

export interface EmbeddingCreateParams {
  input: string | Array<string> | Array<number> | Array<Array<number>>;
  model: string;
  dimensions?: number;
  encoding_format?: "float" | "base64";
  user?: string;
}
