import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    notificationsEnabled: v.optional(v.boolean()),
  }),

  courses: defineTable({
    code: v.string(),
    department: v.string(),
    title: v.string(),
    terms: v.array(v.string()),
    units: v.string(),
  }).index("by_code", ["code"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    date: v.number(),
    duration: v.number(),
    public: v.boolean(),
    yesList: v.array(v.id("users")),
    noList: v.array(v.id("users")),
  }).index("by_date", ["date"]),
});
