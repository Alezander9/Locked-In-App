import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    title: v.string(),
    notes: v.string(),
    dueDate: v.number(),
    isCompleted: v.boolean(),
  }).index("by_userID_dueDate", ["userId", "dueDate"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    completedOnboarding: v.optional(v.boolean()),
    notificationsEnabled: v.optional(v.boolean()),
    profilePictureStorageId: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  courses: defineTable({
    code: v.string(),
    department: v.string(),
    title: v.string(),
    terms: v.array(v.string()),
    units: v.string(),
  }).index("by_code", ["code"]),

  userCourses: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    order: v.optional(v.number()),
    color: v.optional(v.string()),
    quarter: v.optional(v.string()),
  }).index("by_userID_courseID", ["userId", "courseId"]),

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
