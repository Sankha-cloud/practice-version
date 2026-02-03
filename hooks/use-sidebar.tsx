"use client";
import {create} from "zustand";
type SidebarStore={
isCollapsed:boolean,
onToggle:()=>void,
onClose:()=>void,
expand:()=>void
}
const useSidebar=create<SidebarStore>((set)=>({
  isCollapsed:false,
  onToggle:()=>set((state)=>({isCollapsed:!state.isCollapsed})),
  onClose:()=>set({isCollapsed:true}),
  expand:()=>set({isCollapsed:false})
}));
export default useSidebar;
