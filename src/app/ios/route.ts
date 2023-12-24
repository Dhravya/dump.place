import { redirect } from "next/navigation";

export async function GET(request: Request) {
  return redirect("https://www.icloud.com/shortcuts/3e8ab85bb6d94984a2221ab2b0cf8fe9");
}