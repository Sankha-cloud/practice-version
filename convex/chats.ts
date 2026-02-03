import {mutation,query} from "./_generated/server";
import {getAuthUserId} from "@convex-dev/auth/server";
import {v} from "convex/values";

export const createChat=mutation({
  args:{
    title:v.string()
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Unauthorized");
    }
    const chatId=await ctx.db.insert("chats",{
      userId,
      title:args.title,
      createdAt:Date.now(),
      updatedAt:Date.now()
    });
    return chatId;
  }
});
export const getByChatId=query({
  args:{
     chatId:v.id("chats")
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Unauthorized");
    }
    const chat=await ctx.db.get(args.chatId);
    if(!chat || chat.userId !== userId){
      throw new Error("Chat Not Found");
    }
    return chat;
  }
});
export const chatList=query({
  args:{},
  handler:async(ctx)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Unauthorized");
    }
    return await ctx.db.query("chats").withIndex("by_user",q=>q.eq("userId",userId)).order("desc").collect();
  }
})
export const search=query({
  args:{
    searchTerm:v.string()
  },
  handler:async(ctx,args)=>{
   const userId=await getAuthUserId(ctx);
   if(!userId){
    throw new Error("Unauthorized");
   }
   const searchTermLower=args.searchTerm.toLowerCase();
   const chats=await ctx.db.query("chats").withIndex("by_user",q=>q.eq("userId",userId)).collect();
   return chats.filter((chat) =>chat.title.toLowerCase().includes(searchTermLower));
  }
});
export const rename=mutation({
  args:{
    chatId:v.id('chats'),
    title:v.string()
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Not Authroized");
    }
    const chat=await ctx.db.get(args.chatId);
    if(!chat || chat.userId !== userId){
      throw new Error("Chat Not Found");
    }
    await ctx.db.patch(args.chatId,{
      title:args.title,
      updatedAt:Date.now()
    });
  }
});
export const remove=mutation({
  args:{
    chatId:v.id("chats")
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
    //delete all messages of a chat
    const messages=await ctx.db.query("messages").withIndex("by_chat",q=>q.eq("chatId",args.chatId)).collect();
    //traverse through all messages and perform deletion
    for(const message of messages){
      if(message.fileIds){
        for(const fileId of message.fileIds){
          await ctx.storage.delete(fileId);
        }
      }
      await ctx.db.delete(message._id);
    }
    await ctx.db.delete(args.chatId);
  }
});
export const updateTimestamp=mutation({
  args:{
    chatId:v.id("chats")
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
    await ctx.db.patch(args.chatId,{updatedAt:Date.now()});
  }
})