import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";

export async function AdminPage(){
    const dumps = await db.dumps.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    const auth = await getServerAuthSession();

    if (auth?.user.email !== "dhravyashah@gmail.com"){
        notFound()
    }

    return (<></>)
}