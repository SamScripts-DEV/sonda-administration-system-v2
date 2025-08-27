import React from "react";
import Sidebar from "@/shared/components/Sidebar";

const shouldStayExpanded = false;

export default function LayoutSonda({children}: {children: React.ReactNode}){
    return (
        <>
        <Sidebar />
        <main className={`transition-all duration-300 ${shouldStayExpanded ? "": "ml-16"}`}>
            {children}
        </main>
        </>
    );
}