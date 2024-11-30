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
    completedOnboarding: v.boolean(),
    profilePictureStorageId: v.optional(v.id("_storage")),
    backgroundPictureStorageId: v.optional(v.id("_storage")),
    studyProfile: v.optional(
      v.object({
        dorm: v.string(),
        studyLocations: v.array(v.string()),
        alertnessPreference: v.number(),
        punctualityPreference: v.number(),
        learningPreferences: v.record(v.string(), v.number()),
        availableTimeSlots: v.array(
          v.object({
            day: v.string(),
            slots: v.array(v.number()),
          })
        ),
        classes: v.array(
          v.object({
            name: v.string(),
            weeklyHours: v.number(),
            deadlinePreference: v.number(),
            targetGrade: v.string(),
            expectedGrade: v.string(),
            noiseLevel: v.number(),
          })
        ),
        additionalInfo: v.string(),
        shareLocation: v.boolean(),
        syncContacts: v.boolean(),
      })
    ),
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

  matches: defineTable({
    userId: v.id("users"),          // The user who received the match
    matchedUserId: v.id("users"),   // The user they matched with
    matchScore: v.number(),         // Compatibility score (0-100)
    matchReason: v.string(),        // Why they were matched
    status: v.string(),             // "pending", "accepted", "rejected"
    courseId: v.string(),           // The course they matched for
    createdAt: v.number(),          // Timestamp
  }).index("by_userId", ["userId"]) // Index to quickly find user's matches
});
