import Navbar from "@/components/Navbar";
import CorrectIncorrect from "@/components/CorrectIncorrect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import New from "@/components/New";
import StudentDashboard from "@/components/StudentDashboard";

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div className="text-3xl py-24">Hello Student 👋</div>
        <StudentDashboard />
      </div>
    </div>
  );
};

export default page;
