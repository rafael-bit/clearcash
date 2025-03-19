import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { prisma } from '@/services/database';

export async function GET() {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const accounts = await prisma.bankAccount.findMany({
			where: {
				userId: session.user.id as string,
			},
			include: {
				_count: {
					select: { transactions: true }
				}
			}
		});

		return NextResponse.json(accounts);
	} catch (error) {
		console.error('Error fetching bank accounts:', error);
		return NextResponse.json({ error: 'Failed to fetch bank accounts' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { name, institution, type, balance, currency, color } = await request.json();

		const account = await prisma.bankAccount.create({
			data: {
				name,
				institution,
				type,
				balance: parseFloat(balance),
				currency,
				color,
				user: {
					connect: {
						id: session.user.id as string,
					},
				},
			},
		});

		return NextResponse.json(account, { status: 201 });
	} catch (error) {
		console.error('Error creating bank account:', error);
		return NextResponse.json({ error: 'Failed to create bank account' }, { status: 500 });
	}
} 