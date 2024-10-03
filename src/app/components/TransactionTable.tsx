"use client";

import { useState, useEffect } from "react";

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
	const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortOrder, setSortOrder] = useState<{ key: string; ascending: boolean }>({
		key: "",
		ascending: true,
	});
	const [filters, setFilters] = useState({
		description: "",
		minAmount: "",
		maxAmount: "",
		startDate: "",
		endDate: "",
	});
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`https://clearcashback.onrender.com/api/transactions/${user}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch transactions");
				}
				const data: Transaction[] = await response.json();
				setTransactions(data);
				setFilteredTransactions(data);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [user]);

	useEffect(() => {
		let tempTransactions = [...transactions];

		if (filters.description) {
			tempTransactions = tempTransactions.filter((t) =>
				t.description.toLowerCase().includes(filters.description.toLowerCase())
			);
		}

		if (filters.minAmount) {
			tempTransactions = tempTransactions.filter(
				(t) => t.amount >= parseFloat(filters.minAmount)
			);
		}

		if (filters.maxAmount) {
			tempTransactions = tempTransactions.filter(
				(t) => t.amount <= parseFloat(filters.maxAmount)
			);
		}

		if (filters.startDate) {
			tempTransactions = tempTransactions.filter(
				(t) => new Date(t.date) >= new Date(filters.startDate)
			);
		}

		if (filters.endDate) {
			tempTransactions = tempTransactions.filter(
				(t) => new Date(t.date) <= new Date(filters.endDate)
			);
		}

		setFilteredTransactions(tempTransactions);
	}, [filters, transactions]);

	const handleSort = (key: "description" | "date") => {
		const ascending = sortOrder.key === key ? !sortOrder.ascending : true;
		setSortOrder({ key, ascending });

		const sortedTransactions = [...filteredTransactions].sort((a, b) => {
			if (key === "description") {
				return ascending
					? a.description.localeCompare(b.description)
					: b.description.localeCompare(a.description);
			} else {
				return ascending
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime();
			}
		});

		setFilteredTransactions(sortedTransactions);
	};

	const removeTransaction = async (id: string) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`https://clearcashback.onrender.com/api/transactions/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to remove transaction");
			}

			setTransactions(transactions.filter((transaction) => transaction._id !== id));
			window.location.reload();
		} catch (error) {
			console.error("Error removing transaction:", error);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section className="min-h-screen mt-4">
			<div className="box__table overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600">
				<button
					className="mb-4 bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200 px-4 py-2 rounded"
					onClick={() => setShowFilters(!showFilters)}
				>
					{showFilters ? "Hide Filters" : "Show Filters"}
				</button>

				{showFilters && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
						<div className="card p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
							<h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Description</h2>
							<input
								type="text"
								placeholder="Search by description"
								value={filters.description}
								onChange={(e) => setFilters({ ...filters, description: e.target.value })}
								className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
							/>
						</div>

						<div className="card p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
							<h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Amount</h2>
							<div className="flex space-x-2">
								<input
									type="number"
									placeholder="Min amount"
									value={filters.minAmount}
									onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
									className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
								/>
								<input
									type="number"
									placeholder="Max amount"
									value={filters.maxAmount}
									onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
									className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
								/>
							</div>
						</div>

						<div className="card p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
							<h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Date</h2>
							<div className="flex space-x-2">
								<input
									type="date"
									value={filters.startDate}
									onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
									className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
								/>
								<input
									type="date"
									value={filters.endDate}
									onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
									className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
								/>
							</div>
						</div>
					</div>
				)}
				<table id="data-table" className="w-full border-separate border-spacing-y-2">
					<thead>
						<tr className="w-full bg-gray-100 dark:bg-gray-700">
							<th
								className="px-4 py-2 text-left dark:text-gray-200 cursor-pointer flex items-center"
								onClick={() => handleSort("description")}
							>
								Description
								<span
									className={`ml-1 text-sm ${sortOrder.key === "description" ? "text-black dark:text-white" : ""
										}`}
								>
									▼
								</span>
							</th>
							<th className="px-4 py-2 text-left dark:text-gray-200">Amount</th>
							<th
								className="px-4 py-2 text-left dark:text-gray-200 cursor-pointer flex items-center"
								onClick={() => handleSort("date")}
							>
								Date
								<span
									className={`ml-1 text-sm ${sortOrder.key === "date" ? "text-black dark:text-white" : ""
										}`}
								>
									▼
								</span>
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filteredTransactions.map((transaction) => (
							<tr key={transaction._id} className="bg-white dark:bg-gray-700">
								<td className="px-4 py-2 text-gray-900 dark:text-gray-100">
									{transaction.description}
								</td>
								<td
									className={`px-4 py-2 ${transaction.amount > 0 ? "text-green-500" : "text-red-500"
										}`}
								>
									{transaction.amount > 0 ? `+${transaction.amount}` : `${transaction.amount}`}
								</td>
								<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
									{new Date(transaction.date).toLocaleDateString()}
								</td>
								<td>
									<img
										className="cursor-pointer"
										src="/minus.svg"
										alt="Remove transaction"
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