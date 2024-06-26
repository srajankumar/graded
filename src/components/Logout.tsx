import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Logout() {
  return (
    <div>
      <SignOutButton>
        <Button variant={"destructive"}>Sign-out </Button>
      </SignOutButton>
    </div>
  );
}
