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
    console.log("Input search term:", searchTerm);
    console.log("Cleaned term:", cleanedTerm);

    if (!cleanedTerm) {
      return [];
    }

    // Use the index directly on the code field
    const results = await ctx.db
      .query("courses")
      .withIndex("by_code") // We'll need to update the schema to add this index
      .filter((q) =>
        q.and(
          q.gte(q.field("code"), cleanedTerm),
          q.lt(q.field("code"), cleanedTerm + "\uffff")
        )
      )
      .take(10);

    console.log("Results:", results);
    return results;
  },
});
