import { Id } from "./_generated/dataModel";
import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

interface CourseInput {
  code: string;
  department: string;
  title: string;
  description: string;
  terms: string[];
  units: string;
}

interface CoursesInfo {
  [key: string]: CourseInput;
}

export const importCourses = internalMutation({
  args: {
    coursesInfo: v.any(),
  },
  handler: async (ctx, { coursesInfo }) => {
    const batchSize = 50;
    const courses = Object.entries(coursesInfo as CoursesInfo).map(
      ([_, course]) => ({
        code: course.code,
        department: course.department,
        title: course.title,
        terms: course.terms,
        units: course.units,
      })
    );

    // Insert in batches
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      await Promise.all(
        batch.map((course) => ctx.db.insert("courses", course))
      );
    }

    return courses.length;
  },
});

export const toggleEventResponse = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
    response: v.union(v.literal("yes"), v.literal("no")),
  },
  handler: async (ctx, args) => {
    const { eventId, userId, response } = args;

    // Get current event
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    // Create new lists removing user from both
    const newYesList = event.yesList.filter((id) => id !== userId);
    const newNoList = event.noList.filter((id) => id !== userId);

    // Add user to appropriate list if they're not already there
    // or if they're toggling the opposite response
    if (response === "yes") {
      if (!event.yesList.includes(userId)) {
        newYesList.push(userId);
      }
    } else if (response === "no") {
      if (!event.noList.includes(userId)) {
        newNoList.push(userId);
      }
    }

    // Update the event
    await ctx.db.patch(eventId, {
      yesList: newYesList,
      noList: newNoList,
    });
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    completedOnboarding: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user if they don't exist
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      completedOnboarding: args.completedOnboarding,
    });

    return userId;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveProfilePicture = mutation({
  args: {
    storageId: v.id("_storage"),
    userID: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userID, {
      profilePictureStorageId: args.storageId,
    });
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    date: v.number(),
    duration: v.number(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create the event with the current user in the yesList
    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      location: args.location,
      date: args.date,
      duration: args.duration,
      public: args.isPublic,
      yesList: [],
      noList: [],
    });

    return eventId;
  },
});

export const updateStudyProfile = mutation({
  args: {
    studyProfile: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called updateStudyProfile without authentication");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's study profile
    await ctx.db.patch(user._id, {
      studyProfile: args.studyProfile,
      completedOnboarding: true, // Also mark onboarding as complete
    });

    return user._id;
  },
});

export const deleteClass = mutation({
  args: {
    studyProfile: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called deleteClass without authentication");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's study profile
    await ctx.db.patch(user._id, {
      studyProfile: args.studyProfile,
    });

    return user._id;
  },
});
export const generateMatches = mutation({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Get the current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) {
      throw new Error("User not found");
    }
    // Get all users who have completed onboarding
    const potentialMatches = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("completedOnboarding"), true),
          q.neq(q.field("_id"), currentUser._id)
        )
      )
      .collect();
    // Generate fake matches with random scores and reasons
    const matchReasons = [
      "Similar study schedule • Both morning people",
      "Matching learning styles • Similar work habits",
      "Compatible study locations • Similar goals",
      "Both detail-oriented • Complementary strengths",
      "Similar academic interests • Compatible schedules",
    ];
    const matches = potentialMatches.map((user) => ({
      userId: currentUser._id,
      matchedUserId: user._id,
      matchScore: 85 + Math.floor(Math.random() * 15), // Random score between 85-100
      matchReason:
        matchReasons[Math.floor(Math.random() * matchReasons.length)],
      status: "pending",
      courseId: args.courseId,
      createdAt: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
    }));
    // Insert all matches
    await Promise.all(matches.map((match) => ctx.db.insert("matches", match)));
    return matches.length;
  },
});

export const deleteMatch = mutation({
  args: {
    matchId: v.id("matches"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    // Delete the match
    await ctx.db.delete(args.matchId);
  },
});

export const addUserCourse = mutation({
  args: {
    department: v.string(),
    code: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    // Verify the course exists
    const course = await ctx.db
      .query("courses")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    if (!course) {
      throw new Error("Course not found");
    }
    // Get the highest current order
    const userCourses = await ctx.db
      .query("userCourses")
      .withIndex("by_userID_courseID", (q) => q.eq("userId", user._id))
      .collect();
    const maxOrder = Math.max(-1, ...userCourses.map((uc) => uc.order ?? -1));
    // Add the user-course association
    await ctx.db.insert("userCourses", {
      userId: user._id,
      courseId: course._id,
      order: maxOrder + 1,
      color: "#94a3b8", // Default color
    });
  },
});

export const updateUserCourseColor = mutation({
  args: {
    courseId: v.id("courses"),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    const userCourse = await ctx.db
      .query("userCourses")
      .withIndex("by_userID_courseID", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId)
      )
      .first();
    if (!userCourse) {
      throw new Error("User course not found");
    }
    await ctx.db.patch(userCourse._id, { color: args.color });
  },
});
export const saveBackgroundPicture = mutation({
  args: {
    storageId: v.id("_storage"),
    userID: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userID, {
      backgroundPictureStorageId: args.storageId,
    });
  },
});

export const updateUserCoursesOrder = mutation({
  args: {
    courseOrders: v.array(
      v.object({
        courseId: v.id("courses"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update each course's order
    await Promise.all(
      args.courseOrders.map(async ({ courseId, order }) => {
        const userCourse = await ctx.db
          .query("userCourses")
          .withIndex("by_userID_courseID", (q) =>
            q.eq("userId", user._id).eq("courseId", courseId)
          )
          .first();

        if (!userCourse) {
          throw new Error(`User course not found for courseId: ${courseId}`);
        }

        await ctx.db.patch(userCourse._id, { order });
      })
    );
  },
});

export const deleteUserCourse = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const userCourse = await ctx.db
      .query("userCourses")
      .withIndex("by_userID_courseID", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId)
      )
      .first();

    if (!userCourse) {
      throw new Error("User course not found");
    }

    await ctx.db.delete(userCourse._id);
  },
});

export const createTasks = mutation({
  args: {
    tasks: v.array(
      v.object({
        courseId: v.id("courses"),
        title: v.string(),
        notes: v.string(),
        dueDate: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create all tasks
    const taskIds = await Promise.all(
      args.tasks.map(async (task) => {
        // Verify the course exists
        const course = await ctx.db.get(task.courseId);
        if (!course) {
          throw new Error(`Course not found: ${task.courseId}`);
        }

        return await ctx.db.insert("tasks", {
          userId: user._id,
          courseId: task.courseId,
          title: task.title,
          notes: task.notes,
          dueDate: task.dueDate,
          isCompleted: false,
        });
      })
    );

    return taskIds;
  },
});

export const updateTaskCompletion = mutation({
  args: {
    taskId: v.id("tasks"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.taskId, {
      isCompleted: args.isCompleted,
    });

    return args.taskId;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    courseId: v.id("courses"),
    title: v.string(),
    notes: v.string(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to update this task");
    }

    // Verify the course exists
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Update the task
    await ctx.db.patch(args.taskId, {
      courseId: args.courseId,
      title: args.title,
      notes: args.notes,
      dueDate: args.dueDate,
    });

    return args.taskId;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== user._id) {
      throw new Error("Not authorized to delete this task");
    }

    // Delete the task
    await ctx.db.delete(args.taskId);

    return args.taskId;
  },
});

export const restoreTask = mutation({
  args: {
    taskId: v.id("tasks"),
    courseId: v.id("courses"),
    title: v.string(),
    notes: v.string(),
    dueDate: v.number(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Recreate the task with original data
    const taskId = await ctx.db.insert("tasks", {
      userId: user._id,
      courseId: args.courseId,
      title: args.title,
      notes: args.notes,
      dueDate: args.dueDate,
      isCompleted: args.isCompleted,
    });

    return taskId;
  },
});
