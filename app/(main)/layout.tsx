"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import useSidebar from "@/hooks/use-sidebar";
export default function MainLayout({
  children
} :{
  children:React.ReactNode
}){
  const {isCollapsed} = useSidebar();
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar/>
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-0" : "ml-0 md:ml-64"}`}>
      <Navbar/>
      <main className="flex-1 overflow-hidden">{children}</main>
      </div>
     
    </div>
  )
}