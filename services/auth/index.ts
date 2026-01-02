import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../database';
import { Resend } from 'resend';

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
	pages: {
		signIn: '/auth',
		signOut: '/auth',
		error: '/auth',
		verifyRequest: '/auth',
		newUser: '/dashboard',
	},
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async redirect({ url, baseUrl }) {
			if (url === baseUrl || url.startsWith(baseUrl + '/')) {
				return url.startsWith(baseUrl + '/dashboard') ? url : baseUrl + '/dashboard';
			}
			return baseUrl + '/dashboard';
		},
	},
	providers: [
		EmailProvider({
			from: process.env.EMAIL_FROM,
			server: {
				host: 'smtp.resend.com',
				port: 465,
				auth: {
					user: 'resend',
					pass: process.env.RESEND_API_KEY
				}
			},
			sendVerificationRequest: async ({ identifier: email, url }) => {
				try {
					const resend = new Resend(process.env.RESEND_API_KEY!);
					await resend.emails.send({
						from: process.env.EMAIL_FROM!,
						to: email,
						subject: 'Login Link to your Account',
						html: `<p>Click the magic link below to sign in to your account:</p>
                   <p><a href="${url}"><b>Sign in</b></a></p>`,
					});
				} catch (error) {
					console.error('Error sending verification email:', error);
				}
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
});