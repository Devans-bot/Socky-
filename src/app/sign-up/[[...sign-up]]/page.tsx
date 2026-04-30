import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <SignUp routing="path" path="/sign-up" signInUrl="/login" />
    </div>
  );
}
