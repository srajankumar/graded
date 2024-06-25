"use client";
import React from "react";
import { motion, useInView } from "framer-motion";

import { FlipWords } from "./FlipWords";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref) as boolean;

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: +10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const words = ["innovative", "engaging", "advanced", "dynamic"];

  return (
    <section className="w-full min-h-[100dvh]  px-5 py-12 justify-center lg:grid flex flex-col-reverse lg:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <div className="md:text-4xl text-3xl font-normal text-neutral-600">
          Experience
          <FlipWords words={words} /> <br />
          education with{" "}
          <span className="sm:leading-[3.5rem] font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            GradEd.
          </span>
        </div>

        <div className="flex flex-wrap gap-3 md:pt-5 pt-7">
          <Link href="/sign-in">
            <Button>Get Started</Button>
          </Link>
          <Link href="/about">
            <Button variant={"ghost"} className="flex gap-1">
              <div>Learn More</div>
              <ArrowRight className="w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-80 lg:w-auto">
        <img src="/hero.svg" alt="cargo" className="md:flex w-80 md:w-full" />
      </div>
    </section>
  );
};

export default Hero;
