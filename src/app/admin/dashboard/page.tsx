import Navbar from "@/components/Navbar";
import CorrectIncorrect from "@/components/CorrectIncorrect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import New from "@/components/New";

const page = () => {
  return (
    <div className="py-20">
      <Navbar />
      <div className="max-w-5xl min-h-[100dvh] flex flex-col justify-center mx-auto px-5">
        <div className="text-3xl pt-24 pb-20">Hello Educator 👋</div>
        <div className="pb-16">
          <New />
        </div>
      </div>
    </div>
  );
};

export default page;
