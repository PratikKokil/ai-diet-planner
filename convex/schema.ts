import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    credits: v.optional(v.number()),
    height:v.optional(v.float64()),
    weight:v.optional(v.float64()),
    gender:v.optional(v.string()),
    goal:v.optional(v.string()),
    calories:v.optional(v.number()),
    proteins:v.optional(v.number()),
  }).index("by_email", ["email"]),
});
