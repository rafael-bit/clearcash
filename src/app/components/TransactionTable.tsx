"use client";

import { useState, useEffect } from 'react';

interface Transaction {
	_id: string;
	description: string;
	amount: number;
	date: string;
}

interface TransactionTableProps {
	user: string;
}

export default function TransactionTable({ user }: TransactionTableProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortOrder, setSortOrder] = useState<{ key: string; ascending: boolean }>({
		key: '',
		ascending: true,
	});

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await fetch(`http://localhost:8080/api/transactions/${user}`);
				if (!response.ok) {
					throw new Error('Failed to fetch transactions');
				}
				const data: Transaction[] = await response.json();
				setTransactions(data);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [user]);

	const removeTransaction = async (id: string) => {
		try {
			const response = await fetch(`http://localhost:8080/api/transactions/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to remove transaction');
			}

			setTransactions(transactions.filter(transaction => transaction._id !== id));
			window.location.reload();
		} catch (error) {
			console.error('Error removing transaction:', error);
		}
	};

	const handleSort = (key: 'description' | 'date') => {
		const ascending = sortOrder.key === key ? !sortOrder.ascending : true;
		setSortOrder({ key, ascending });

		const sortedTransactions = [...transactions].sort((a, b) => {
			if (key === 'description') {
				return ascending
					? a.description.localeCompare(b.description)
					: b.description.localeCompare(a.description);
			} else {
				return ascending
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime();
			}
		});

		setTransactions(sortedTransactions);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section className="min-h-screen mt-4">
			<div className="box__table overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600">
				<table id="data-table" className="w-full border-separate border-spacing-y-2">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-700">
							<th
								className="px-4 py-2 text-left dark:text-gray-200 cursor-pointer flex items-center"
								onClick={() => handleSort('description')}
							>
								Descrição
								<span className={`ml-1 text-sm ${sortOrder.key === 'description' ? 'text-black dark:text-white' : ''}`}>
									▼
								</span>
							</th>
							<th className="px-4 py-2 text-left dark:text-gray-200">Valor</th>
							<th
								className="px-4 py-2 text-left dark:text-gray-200 cursor-pointer flex items-center"
								onClick={() => handleSort('date')}
							>
								Data
								<span className={`ml-1 text-sm ${sortOrder.key === 'date' ? 'text-black dark:text-white' : ''}`}>
									▼
								</span>
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction) => (
							<tr
								key={transaction._id}
								className="bg-white dark:bg-gray-700 opacity-70 hover:opacity-100 rounded-lg"
							>
								<td className="px-4 py-2 text-gray-900 dark:text-gray-100">{transaction.description}</td>
								<td className={`px-4 py-2 ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
									{transaction.amount > 0
										? `+R$ ${transaction.amount}`
										: `-R$ ${Math.abs(transaction.amount)}`}
								</td>
								<td className="px-4 py-2 text-gray-900 dark:text-gray-100">
									{new Date(transaction.date).toLocaleDateString()}
								</td>
								<td className="px-4 py-2">
									<img
										className="cursor-pointer"
										src="/minus.svg"
										alt="Remover transação"
										onClick={() => removeTransaction(transaction._id)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}