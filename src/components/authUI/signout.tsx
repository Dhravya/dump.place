"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton({className = ''}: {className?: string}) {
  return <Button className={className} onClick={() => signOut()}>Sign Out</Button>;
}
