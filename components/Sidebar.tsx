import { Button } from "./ui/button";
import {Plus} from "lucide-react";
import {PanelLeftClose} from "lucide-react";
import useSidebar from "@/hooks/use-sidebar";
import {Search} from "lucide-react";
import {Input} from "./ui/input";
import {useState} from "react";
import { X } from 'lucide-react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {MessageSquare} from "lucide-react";
import {useRouter} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
export default function(){
  const {isCollapsed,onClose}=useSidebar();
  const [searchTerm,setSearchTerm]=useState("");
  const chatsList=useQuery(api.chats.chatList);
  const router=useRouter();
  function handleNewChat(){
    router.push("/");
  }
  function handleChatClick(chatId:Id<"chats">){
    router.push(`/chat/${chatId}`);
  }
  return isCollapsed === false ?(
     <aside className="flex flex-col min-h-screen bg-sidebar w-64 fixed left-0 top-0 z-10">
     <div className="flex items-center justify-between p-3 border-b-3 border-sidebar-border ">
      <Button variant="ghost" onClick={handleNewChat}>
        <Plus className="h-6 w-6"/>
        <p>New Chat</p>
      </Button>
      <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-2"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
     </div>
     <div className="p-3 border-b border-border">
    <div className="relative ">
    <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
      <Input placeholder="Search Chat..." className="p-2 m-2 border-2 border-black w-[200px] pl-9 pr-9" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
      {
        searchTerm.length > 0 && (<X className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer " onClick={()=>setSearchTerm("")}/>)
      }
    </div>
    </div>
    <div className="flex justify-between p-3 border-b border-border flex-col gap-2">
      <p className="text-sm font-medium ml-2">Your Chats</p>
      {
        chatsList && chatsList.length > 0 ? (
          <div className="flex flex-col gap-2">
            {
              chatsList.map((chat)=>(
                <div key={chat._id} onClick={()=>handleChatClick(chat._id)}>
                  <MessageSquare className="h-4 w-4"/>
                  <p>{chat.title.slice(0,25)}{chat.title.length > 25 ? "..." : ""}</p>
                </div>
              ))
            }
            </div>
        ):(<p className="text-sm text-muted-foreground ml-2">No chats found</p>)
      }
    </div>
     </aside>
  ):null;
}