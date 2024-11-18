import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const searchCourses = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const { searchTerm } = args;
    const cleanedTerm = searchTerm.trim().toUpperCase();

    if (!cleanedTerm) {
      return [];
    }

    return await ctx.db
      .query("courses")
      .withIndex("by_code", (q) =>
        // Narrow down the range as much as possible
        q.gte("code", cleanedTerm).lt("code", cleanedTerm + "\uffff")
      )
      .take(10);
  },
});
