import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/queries";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar user={null} />
      <div className="flex flex-1 items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
