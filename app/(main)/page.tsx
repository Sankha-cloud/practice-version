"use client";
import { Button } from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
export default function HomePage() {
  const router=useRouter();
  const [isLoading,setIsLoading]=useState(false);
  const createChat=useMutation(api.chats.createChat);
  const createMessage=useMutation(api.messages.createMessage);
  const generateUploadUrl=useMutation(api.file.generateUploadUrl);
  async function handleSubmit(content:string,files:File[]){
    try{
      setIsLoading(true);
      const {fileIds,fileTypes,fileNames}=await uploadFiles(
        files,
        generateUploadUrl,
        async ()=>null
      );
      const title=content.trim().slice(0,20) || "New Chat";
      const chatId=await createChat({title});
      await createMessage({
        chatId,
        role:"user",
        content,
        fileIds:fileIds.length > 0 ? fileIds :undefined,
        fileTypes:fileTypes.length > 0 ? fileTypes: undefined,
        fileNames:fileNames.length > 0 ? fileNames : undefined

      });
      router.push(`/chat/${chatId}`);
    }
    catch(err){
      console.error(err);
    }
    finally{
      setIsLoading(false);
    }
  }
  const arr=[
    "Explain quantum computing in simple terms",
    "Help me write a Python script to process CSV files",
    "What are the best practices for React development?",
    "Create a meal plan for the week",
  ];
  return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chatbot</h1>
        <p className="text-muted-foreground">
          Start a new conversation or select a chat from the sidebar
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {
          arr.map((item,index)=>(
            <button key={index} className="h-30 w-40 border-2 border-gray-300 rounded-md p-4" disabled={isLoading} onClick={()=>handleSubmit(item,[])}>{item}</button>
          ))
        }
      </div>
      
    </div>
  );
}
