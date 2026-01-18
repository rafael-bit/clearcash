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
			include: { bankAccount: true, documents: true },
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
			include: { bankAccount: true, documents: true },
		});

		if (!transaction) {
			return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
		}

		if (transaction.userId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const { title, description, amount, type, category, date, bankAccountId, documents } = await request.json();

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

			// Processar a data corretamente para evitar problemas de timezone
			let transactionDate: Date;
			if (date) {
				// Se a data vem no formato YYYY-MM-DD, criar como data local
				const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
				if (dateMatch) {
					const [, year, month, day] = dateMatch;
					transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
				} else {
					transactionDate = new Date(date);
				}
			} else {
				transactionDate = transaction.date;
			}
			
			// Preparar dados de atualização
			const updateData: Prisma.TransactionUpdateInput = {
				title,
				description: description || null,
				amount: parseFloat(amount),
				type,
				category,
				date: transactionDate,
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

			// Gerenciar documentos
			if (documents !== undefined) {
				// Remover documentos existentes
				await tx.document.deleteMany({
					where: { transactionId: id },
				});

				// Adicionar novos documentos se fornecidos
				if (Array.isArray(documents) && documents.length > 0) {
					await tx.document.createMany({
						data: documents.map((doc: { url: string; fileName: string; mimeType: string }) => ({
							url: doc.url,
							fileName: doc.fileName,
							mimeType: doc.mimeType,
							transactionId: id,
						})),
					});
				}
			}

			// Atualizar a transação
			const updatedTransaction = await tx.transaction.update({
				where: { id },
				data: updateData,
				include: {
					bankAccount: true,
					documents: true,
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
			include: { bankAccount: true, documents: true },
		});

		return NextResponse.json(updatedTransaction);
	} catch (error) {
		console.error('Error updating transaction:', error);
		return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
	}
}
