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
        <div className="flex gap-5">
          <Link href="/admin/add-test">
            <Button>Add Test</Button>
          </Link>
          <Link href="/admin/test-result">
            <Button>See Results</Button>
          </Link>
        </div>
        <div>
          <CorrectIncorrect />
          <New />
        </div>
      </div>
    </div>
  );
};

export default page;
