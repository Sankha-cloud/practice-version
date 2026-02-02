import {mutation,query} from "./_generated/server";
import {getAuthUserId} from "@convex-dev/auth/server";
import {v} from 'convex/values';
export const createMessage=mutation({
  args:{
    chatId:v.id("chats"),
    role:v.union(v.literal("user") ,v.literal("assistant")),
    content:v.string(),
    fileIds:v.optional(v.array(v.id("_storage"))),
    fileTypes:v.optional(v.array(v.string())),
    fileNames:v.optional(v.array(v.string())),

  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Not Authorized");
    }
    const chat=await ctx.db.get(args.chatId);
    if(!chat || chat.userId !== userId){
      throw new Error("Chat Not Found");
    }
    const messageId=await ctx.db.insert("messages",{
      chatId:args.chatId,
      role:args.role,
      content:args.content,
      fileIds:args.fileIds,
      fileTypes:args.fileTypes,
      fileNames:args.fileNames,
      createdAt:Date.now()
    });
    await ctx.db.patch(args.chatId,{
      updatedAt:Date.now()
    })
  }
});
export const updateContent=mutation({
  args:{
    messageId:v.id("messages"),
    content:v.string()
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Not Authorized");
    }
    const message=await ctx.db.get(args.messageId);
    if(!message ){
      throw new Error("Message Not Found");
    }
    await ctx.db.patch(args.messageId,{content:args.content});
  }
});
//get by chatId
export const getByChatId=query({
  args:{
    chatId:v.id("chats")
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Not Authorized");}
      const chat=await ctx.db.get(args.chatId);
      if(!chat || chat.userId !== userId){
        return []
      }
      const messages=await ctx.db.query("messages").withIndex("by_chat",q=>q.eq("chatId",args.chatId)).order("asc").collect();
      const messageWithUrl=await Promise.all(messages.map(async (message)=>{
        if(message.fileIds && message.fileIds.length > 0){
          const fileUrls=await Promise.all(message.fileIds.map(async (fileId)=>{
            const fileUrl=await ctx.storage.getUrl(fileId);
            return fileUrl;
          }));
          //missing fileTypes
          let fileTypes=message.fileTypes;
          if(!fileTypes || fileTypes.length === 0){
            fileTypes=await Promise.all(message.fileIds.map(async(fileId)=>{
              try{
                const metadata=await ctx.db.system.get("_storage",fileId);
                return metadata?.contentType || "";
              }
              catch {
                return "";
              }
            }));
           fileTypes=fileTypes.filter((type)=>type !== "");
           
          }
         return {
          ...message,
          fileUrls:fileUrls.filter((url)=>url !==""),
          fileTypes:fileTypes.filter((type)=>type !== "")
         }
        }
      }));
      return messageWithUrl;

  }
})