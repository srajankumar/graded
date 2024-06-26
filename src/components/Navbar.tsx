"use client";
import { useUser } from "@clerk/nextjs";
import Logout from "@/components/Logout";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const supabase = createClient();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const { data, error } = await supabase
        .from("auth")
        .select("userId, admin")
        .eq("userId", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching admin status:", error);
      } else if (data) {
        setIsAdmin(data.admin);
      }
    };

    if (user) {
      fetchAdminStatus();
    }
  }, [user, supabase]);

  return (
    <nav className="flex max-w-5xl px-5 mx-auto py-10 justify-between items-center">
      <Link href={isAdmin ? "/admin/dashboard" : "/student/dashboard"}>
        <Image
          src="/logo.png"
          width={500}
          height={500}
          className="w-10 h-10 rounded-lg shadow-md"
          alt="GradEd"
        />
      </Link>
      <div className="flex justify-center items-center gap-2">
        <h1 className="font-medium">
          {user?.firstName} {user?.lastName}
        </h1>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;
