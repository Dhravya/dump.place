"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return <Button onClick={() => signIn()} className="px-4 py-3 bg-gradient-to-tr from-purple-200/20 via-purple-400/20 via-tranparent rounded-2xl">Sign In</Button>;
}
