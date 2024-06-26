"use client";
import { useUser } from "@clerk/nextjs";
import Logout from "@/components/Logout";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <UserButton afterSignOutUrl="/" />
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
