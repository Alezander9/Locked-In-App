import { action, ActionCtx, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { ChatCompletionMessageParam, chat } from "./llm";

export const internalRequestAIResponse = internalAction({
  args: {
    prompt: v.string(),
  },
  handler: async (_ctx, args) => {
    // Get the OpenAI API key from the environment
    const openAIKey = process.env.LLM_API_KEY;
    if (!openAIKey) {
      throw new Error("LLM_API_KEY is not set in the environment");
    }

    // Prepare the messages array for the chat
    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: args.prompt },
    ];

    try {
      // Use the chatStream function from llm.ts
      const response = await chat(messages, openAIKey);
      console.log(`sending respose ${response}`);
      return response;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error(
        `Error generating AI response: ${(error as Error).message}`
      );
    }
  },
});

type AIResponse = string;

export const clientRequestAIResponse = action({
  args: { prompt: v.string() },
  handler: async (
    ctx: ActionCtx,
    args: { prompt: string }
  ): Promise<AIResponse> => {
    // Add any necessary validation or preprocessing here
    const response = await ctx.runAction(
      internal.actions.internalRequestAIResponse,
      args
    );
    return response;
  },
});
