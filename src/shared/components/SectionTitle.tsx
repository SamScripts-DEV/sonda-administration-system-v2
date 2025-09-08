import React from "react";

interface SectionTitleProps {
    icon: React.ReactNode;
    label: string;
}

export function SectionTitle({ icon, label }: SectionTitleProps) {
  return (
    <div className="flex items-center space-x-3 mb-5">
      {icon}
      <h1 className="text-3xl font-bold tracking-tight">{label}</h1>
    </div>
  );
}
