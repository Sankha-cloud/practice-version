import { Button } from "./ui/button";
import {Plus} from "lucide-react";
import {PanelLeftClose} from "lucide-react";
import useSidebar from "@/hooks/use-sidebar";
import {Search} from "lucide-react";
import {Input} from "./ui/input";
import {useState} from "react";
import { X } from 'lucide-react';
export default function(){
  const {onClose}=useSidebar();
  const [searchTerm,setSearchTerm]=useState("");
  return (
     <aside className="flex flex-col min-h-screen bg-sidebar">
     <div className="flex items-center justify-between p-3 border-b-3 border-sidebar-border ">
      <Button variant="ghost" >
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
    <div className="flex items-center justify-between p-3 border-b border-border">
      <p>Your Chats</p>
    </div>
     </aside>
  )
}