import { env } from "@/env";
import { prompt } from "@/lib/prompt";

export async function moderate(text: string) {
    console.log("HI")
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.MODERATOR_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "mistralai/mistral-7b-instruct", // Optional (user controls the default),
            "messages": [
                { "role": "system", "content": prompt },
                { "role": "user", "content": text }
            ]
        })
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
   return json.choices[0].message.content;
}