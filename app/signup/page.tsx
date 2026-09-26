import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import SignupForm from "@/components/SignupForm";
import { getCurrentUser } from "@/lib/queries";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar user={null} />
      <div className="flex flex-1 items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  );
}
