import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <SignIn routing="path" path="/login" signUpUrl="/sign-up" />
    </div>
  );
}
