import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  courses: defineTable({
    code: v.string(),
    department: v.string(),
    title: v.string(),
    description: v.string(),
    terms: v.array(v.string()),
    units: v.string(),
  })
    .index("by_code", ["code"])
    .index("by_title", ["title"]),
});
