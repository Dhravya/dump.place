"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return <Button onClick={() => signIn()}>Sign In</Button>;
}
