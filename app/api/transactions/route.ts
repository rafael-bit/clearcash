import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { prisma } from '@/services/database';

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const month = searchParams.get('month');
	const year = searchParams.get('year');
	const bankAccountId = searchParams.get('bankAccountId');

	let dateFilter = {};

	if (month && year) {
		const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
		const endDate = new Date(parseInt(year), parseInt(month), 0);

		dateFilter = {
			date: {
				gte: startDate,
				lte: endDate,
			},
		};
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId: session.user.id as string,
				bankAccountId: bankAccountId || undefined,
				...dateFilter,
			},
			include: {
				bankAccount: true,
			},
			orderBy: {
				date: 'desc',
			},
		});

		return NextResponse.json(transactions);
	} catch (error) {
		console.error('Error fetching transactions:', error);
		return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { title, description, amount, type, category, date, bankAccountId } = await request.json();
		const result = await prisma.$transaction(async (tx) => {
			const transaction = await tx.transaction.create({
				data: {
					title,
					description,
					amount: parseFloat(amount),
					type,
					category,
					date: date ? new Date(date) : new Date(),
					user: {
						connect: {
							id: session.user?.id as string,
						},
					},
					...(bankAccountId && {
						bankAccount: {
							connect: {
								id: bankAccountId,
							},
						},
					}),
				},
			});

			if (bankAccountId) {
				const bankAccount = await tx.bankAccount.findUnique({
					where: { id: bankAccountId },
				});

				if (bankAccount) {
					const updatedBalance = type === 'INCOME'
						? bankAccount.balance + parseFloat(amount)
						: bankAccount.balance - parseFloat(amount);

					await tx.bankAccount.update({
						where: { id: bankAccountId },
						data: { balance: updatedBalance },
					});
				}
			}

			return transaction;
		});

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error('Error creating transaction:', error);
		return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
	}
} 