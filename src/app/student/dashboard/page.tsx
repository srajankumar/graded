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
      <div className="max-w-5xl min-h-[100dvh] flex-col justify-center flex mx-auto px-5">
        <div className="text-3xl pt-5 pb-3">Hello Student 👋</div>
        <div className="pb-16 text-lg">Ready to take a test?</div>
      </div>
    </div>
  );
};

export default page;
