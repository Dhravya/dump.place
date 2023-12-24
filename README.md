# DUMP.place

## Description
I created this app as a minimal, nice place to dump my thoughts and see what others are thinking.

## Installation
1. Clone the repo
2. Run `npm install`
3. Run `npm start`

Environment variables:
```
DATABASE_URL="postgres://user:password@localhost:5432/dumpplace"

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
# NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

EMAIL_TOKEN="Your email token"
```

## Tech Stack
- Next.js
- NextAuth.js
- PostgreSQL on Supabase
- TailwindCSS
- Vercel
- Cloudflare Emails for sending emails

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.