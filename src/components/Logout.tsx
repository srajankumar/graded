import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Logout() {
  return (
    <div>
      <SignOutButton>
        <Link href="/">
          <Button variant={"destructive"}>Sign-out </Button>
        </Link>
      </SignOutButton>
    </div>
  );
}
