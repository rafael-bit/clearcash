	import NextAuth from 'next-auth';
	import EmailProvider from 'next-auth/providers/email';
	import GitHubProvider from 'next-auth/providers/github';
	import GoogleProvider from 'next-auth/providers/google';
	import { PrismaAdapter } from '@auth/prisma-adapter';
	import { prisma } from '../database';
	import { sendVerificationRequest } from '../util';

	export const {
		handlers: { GET, POST },
		auth,
	} = NextAuth({
		pages: {
			signIn: '/auth',
			signOut: '/auth',
			error: '/auth',
			verifyRequest: '/auth',
			newUser: '/app',
		},
		secret: process.env.NEXTAUTH_SECRET,
		adapter: PrismaAdapter(prisma),
		providers: [
			EmailProvider({
				server: process.env.EMAIL_SERVER,
				from: process.env.EMAIL_FROM,
				sendVerificationRequest,
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