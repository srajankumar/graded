"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Logout from "@/components/Logout";
import { Variants, motion } from "framer-motion";

const Page = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const sendData = async () => {
      try {
        // Extract the email address
        const emailAddress = user?.emailAddresses?.[0]?.emailAddress || "";

        // Check if the userId already exists in the auth table
        const { data: existingUser, error: fetchError } = await supabase
          .from("auth")
          .select("userId, admin")
          .eq("userId", userId)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching data:", fetchError.message);
          return;
        }

        // If userId does not exist, insert the new userId with admin set to false
        if (!existingUser) {
          const { data, error } = await supabase.from("auth").insert([
            {
              userId: userId,
              userEmail: emailAddress,
              admin: false,
            },
          ]);

          if (error) {
            console.error("Error adding data:", error.message);
          } else {
            console.log(data, "added success");
            router.push("/student/dashboard");
          }
        } else {
          // Redirect based on the admin status
          if (existingUser.admin) {
            router.push("/admin/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

    if (userId) {
      sendData();
    }
  }, [supabase, userId, router]);

  return (
    <div className="flex min-h-[100dvh] justify-center items-center">
      <BarLoader />
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.5,
      ease: "circIn",
    },
  },
} as Variants;

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.1,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      <motion.div variants={variants} className="h-12 w-2 bg-primary" />
    </motion.div>
  );
};

export default Page;
