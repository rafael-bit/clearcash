import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { prisma } from '@/services/database';
import { Prisma } from '@prisma/client';

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: { bankAccount: true },
		});

		if (!transaction) {
			return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
		}

		if (transaction.userId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Reverter o saldo da conta bancária se a transação estava vinculada a uma conta
		if (transaction.bankAccountId && transaction.bankAccount) {
			const updatedBalance = transaction.type === 'INCOME'
				? transaction.bankAccount.balance - transaction.amount
				: transaction.bankAccount.balance + transaction.amount;

			await prisma.$transaction(async (tx) => {
				await tx.transaction.delete({
					where: { id },
				});

				await tx.bankAccount.update({
					where: { id: transaction.bankAccountId! },
					data: { balance: updatedBalance },
				});
			});
		} else {
			await prisma.transaction.delete({
				where: { id },
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting transaction:', error);
		return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: { bankAccount: true },
		});

		if (!transaction) {
			return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
		}

		if (transaction.userId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const { title, description, amount, type, category, date, bankAccountId } = await request.json();

		await prisma.$transaction(async (tx) => {
			// Reverter o saldo antigo se havia uma conta vinculada
			if (transaction.bankAccountId && transaction.bankAccount) {
				const oldBalanceAdjustment = transaction.type === 'INCOME'
					? transaction.bankAccount.balance - transaction.amount
					: transaction.bankAccount.balance + transaction.amount;

				await tx.bankAccount.update({
					where: { id: transaction.bankAccountId },
					data: { balance: oldBalanceAdjustment },
				});
			}

			// Preparar dados de atualização
			const updateData: Prisma.TransactionUpdateInput = {
				title,
				description: description || null,
				amount: parseFloat(amount),
				type,
				category,
				date: date ? new Date(date) : transaction.date,
			};

			// Lidar com mudança de conta bancária
			if (bankAccountId && bankAccountId !== transaction.bankAccountId) {
				// Nova conta ou mudança de conta
				updateData.bankAccount = {
					connect: { id: bankAccountId },
				};
			} else if (!bankAccountId && transaction.bankAccountId) {
				// Remover conta bancária
				updateData.bankAccount = {
					disconnect: true,
				};
			}

			// Atualizar a transação
			const updatedTransaction = await tx.transaction.update({
				where: { id },
				data: updateData,
				include: {
					bankAccount: true,
				},
			});

			// Aplicar o novo saldo se há uma conta vinculada
			const finalBankAccountId = bankAccountId || transaction.bankAccountId;
			if (finalBankAccountId) {
				const bankAccount = await tx.bankAccount.findUnique({
					where: { id: finalBankAccountId },
				});

				if (bankAccount) {
					const newBalanceAdjustment = type === 'INCOME'
						? bankAccount.balance + parseFloat(amount)
						: bankAccount.balance - parseFloat(amount);

					await tx.bankAccount.update({
						where: { id: finalBankAccountId },
						data: { balance: newBalanceAdjustment },
					});
				}
			}

			return updatedTransaction;
		});

		const updatedTransaction = await prisma.transaction.findUnique({
			where: { id },
			include: { bankAccount: true },
		});

		return NextResponse.json(updatedTransaction);
	} catch (error) {
		console.error('Error updating transaction:', error);
		return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
	}
}
