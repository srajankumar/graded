import Navbar from "@/components/Navbar";
import CorrectIncorrect from "@/components/CorrectIncorrect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AdminDashboard from "@/components/AdminDashboard";

const page = () => {
  return (
    <div className="py-20 min-h-[100dvh]">
      <Navbar />
      <div className="max-w-5xl flex flex-col mx-auto px-5">
        <div className="text-3xl pt-24 pb-20">Hello Educator 👋</div>
        <AdminDashboard />
      </div>
    </div>
  );
};

export default page;
