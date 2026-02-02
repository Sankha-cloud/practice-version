import {defineSchema,defineTable} from "convex/server";
import {authTables} from "@convex-dev/auth/server";
import {v} from "convex/values";
export default defineSchema({
  ...authTables,
  chats:defineTable({
    userId:v.id("users"),
    title:v.string(),
    createdAt:v.number(),
    updatedAt:v.number()
  })
  .index("by_user",["userId"])
  .index("by_user_updated",["userId",'updatedAt']),
  messages:defineTable({
   chatId:v.id("chats"),
  role:v.union(v.literal("user") ,v.literal("assistant")),
  content:v.string(),
  fileIds:v.optional(v.array(v.id("_storage"))),
  fileUrls:v.optional(v.array(v.string())),
  fileTypes:v.optional(v.array(v.string())),
  fileNames:v.optional(v.array(v.string())),
  createdAt:v.number()
  })
  .index("by_chat",["chatId"])
})