<p align="center">
   <img src="git/readme.png" style="border-radius: 10px;" width="500"/>
</p>

<h1 align="center">
    <a href="#">ClearCash</a>
</h1>

<p align="center">
    ClearCash is a financial management application designed to help users track expenses, manage budgets, and gain financial insights with ease.
</p>

<p align="center">
  <a href="https://github.com/rafael-bit/clearcash">
   	<img src="https://img.shields.io/github/stars/rafael-bit/clearcash?label=rafael-bit%2Fclearcash" alt="ClearCash repository stars count" />
  </a>
</p>

# 🚀 How It Works

ClearCash enables users to efficiently manage their financial activities with features such as budget tracking, expense categorization, and insightful data visualization. It integrates authentication, email notifications, and customizable themes for a seamless user experience.

## 👷 Running Locally

#### Clone the repository

```bash
git clone https://github.com/rafael-bit/clearcash
```

#### Install dependencies

```bash
npm install
```

#### Configure environment variables

Copy the `env.example` file to `.env` and fill in the required variables:

```bash
cp env.example .env
```

**Required variables:**
- `DATABASE_URL` - MongoDB connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate with: `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Your application URL (e.g., `http://localhost:3000`)

**Cloudflare R2 (for document uploads):**
- `R2_ACCOUNT_ID` - Your Cloudflare Account ID
- `R2_ACCESS_KEY_ID` - R2 Access Key ID
- `R2_SECRET_ACCESS_KEY` - R2 Secret Access Key
- `R2_BUCKET_NAME` - Your R2 bucket name
- `R2_PUBLIC_URL` - Public URL for your R2 bucket (e.g., `https://your-bucket.r2.dev`)

**Optional variables:**
- `EMAIL_FROM` - Email address for sending emails
- `RESEND_API_KEY` - Resend API key for email service
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth credentials
- `GOOGLE_ID` / `GOOGLE_SECRET` - Google OAuth credentials

#### Run the application

```bash
npm run dev
```

Open this address in your browser: [ClearCash](http://localhost:3000/)

# 💻 Technologies

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon Database](https://neon.tech/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [React Hook Form](https://react-hook-form.com/)
- [Resend](https://resend.com/)

# 🚩 Bugs

Feel free to **report a new issue** with an appropriate title and description.

# 💡 Author

- Rafael Áquila ([@rafael-bit](https://github.com/rafael-bit))

# 🔧 Contributing

Check the [contribution page](https://github.com/rafael-bit/clearcash/) to see the best places to report issues, start discussions, and contribute.