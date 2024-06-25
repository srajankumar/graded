import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] justify-center items-center">
      <SignUp />
    </div>
  );
}
