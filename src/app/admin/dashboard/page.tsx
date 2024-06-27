import Navbar from "@/components/Navbar";
import CorrectIncorrect from "@/components/CorrectIncorrect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import New from "@/components/New";

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-3xl py-5">Hello Educator 👋</div>
        <div className="pb-16">
          <New />
        </div>
      </div>
    </div>
  );
};

export default page;
