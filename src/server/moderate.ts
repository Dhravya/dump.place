import { env } from "@/env";

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
                { "role": "system", "content": "You are a content moderator. Your job is to moderate all text posted on a social media. Make sure that it isn't spam or targetted hate. REPLY WIH ONLY ONE WORD. SPAM or OK. if it's just random characters like askjdofjad;sklf, it's SPAM. If it's a proper sentence that's not hateful, and just a normal comment, it's OK. YOU MUST NOT REPLY WITH ANYTHING ELSE. Here's you first comment (SPAM OR OK?): " },
                { "role": "user", "content": text }
            ]
        })
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
   return json.choices[0].message.content;
}