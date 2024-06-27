"use client";
import { useUser } from "@clerk/nextjs";
import Logout from "@/components/Logout";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";

import { SignOutButton } from "@clerk/nextjs";

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
      <div className="flex justify-center items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <h1 className="font-medium">
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <Sheet>
        <SheetTrigger>
          <AlignJustify className="hover:text-primary transition-colors duration-200" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <Image
              src="/logo.png"
              width={500}
              height={500}
              className="w-10 h-10 rounded-lg shadow-md"
              alt="GradEd"
            />
            <SheetTitle className="pt-2">GradEd</SheetTitle>
            <SheetDescription>
              {
                "A modern, innovative education platform that empowers students to achieve their academic goals and succeed in their future endeavors. We believe that education is a journey, not a destination, and that every student deserves access to the resources and support they need to thrive."
              }
            </SheetDescription>
            <div className="w-full h-full flex flex-col justify-between">
              {" "}
              <div className="pt-3 flex flex-col gap-5">
                <Link href="/admin/dashboard">
                  <Button variant={"secondary"} className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/add-test">
                  <Button variant={"secondary"} className="w-full">
                    Add Test
                  </Button>
                </Link>
                <Link href="/admin/test-result">
                  <Button variant={"secondary"} className="w-full">
                    See Results
                  </Button>
                </Link>
              </div>
              <div className="absolute w-full bottom-5 pr-12">
                <SignOutButton>
                  <Button variant={"destructive"} className="w-full">
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
