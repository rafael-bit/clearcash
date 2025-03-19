"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import clsx from "clsx";
import { useVisibility } from "./VisibilityProvider";
import { format } from "date-fns";

const categoryIcons: Record<string, string> = {
	food: "/icons/food.svg",
	home: "/icons/house.svg",
	education: "/icons/education.svg",
	leisure: "/icons/leisure.svg",
	market: "/icons/market.svg",
	clothing: "/icons/clothing.svg",
	health: "/icons/health.svg",
	transport: "/icons/transport.svg",
	travel: "/icons/travel.svg",
	salary: "/icons/incomeColor.svg",
	other: "/icons/expensesColor.svg",
};

interface Transaction {
	id: string;
	title: string;
	description?: string;
	amount: number;
	type: "INCOME" | "EXPENSE";
	category: string;
	date: string;
	bankAccountId?: string;
	bankAccount?: {
		name: string;
		institution: string;
		color: string;
	};
}

interface MonthData {
	month: number;
	year: number;
	label: string;
	transactions: Transaction[];
	isLoading: boolean;
}

export default function Details() {
	const { isHidden } = useVisibility();
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
	const [months, setMonths] = useState<MonthData[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [isLoading, setIsLoading] = useState(true);
	const [selectedMonth] = useState<Date>(new Date());
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		const generateMonths = () => {
			const now = new Date();
			const monthsArray: MonthData[] = [];

			for (let i = 0; i < 12; i++) {
				const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
				monthsArray.push({
					month: date.getMonth(),
					year: date.getFullYear(),
					label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
					transactions: [],
					isLoading: true
				});
			}

			return monthsArray;
		};

		setMonths(generateMonths());
	}, []);

	useEffect(() => {
		if (months.length === 0) return;

		const fetchTransactions = async () => {
			try {
				setIsLoading(true);
				const currentMonthData = months.find(m => m.month === currentMonth && m.year === currentYear);

				if (!currentMonthData) return;

				const response = await fetch(`/api/transactions?month=${currentMonth + 1}&year=${currentYear}`);

				if (!response.ok) throw new Error('Failed to fetch transactions');

				const data = await response.json();

				setMonths(prev => prev.map(month => {
					if (month.month === currentMonth && month.year === currentYear) {
						return {
							...month,
							transactions: data,
							isLoading: false
						};
					}
					return month;
				}));

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching transactions:', error);
				setIsLoading(false);
			}
		};

		fetchTransactions();
	}, [currentMonth, currentYear, months]);

	useEffect(() => {
		const handleAccountSelected = (event: CustomEvent<string>) => {
			setSelectedAccountId(event.detail);
		};

		window.addEventListener('accountSelected', handleAccountSelected as EventListener);

		return () => {
			window.removeEventListener('accountSelected', handleAccountSelected as EventListener);
		};
	}, []);

	const getCurrentMonthTransactions = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/transactions?month=${selectedMonth.getMonth() + 1}&year=${selectedMonth.getFullYear()}`);
			if (!response.ok) throw new Error('Failed to fetch transactions');

			let data = await response.json();

			if (selectedAccountId) {
				data = data.filter((transaction: Transaction) => transaction.bankAccountId === selectedAccountId);
			}

			setTransactions(data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getCurrentMonthTransactions();
	}, [selectedMonth, selectedAccountId, getCurrentMonthTransactions]);

	useEffect(() => {
		const handleTransactionUpdate = () => {
			getCurrentMonthTransactions();
		};

		window.addEventListener('transactionUpdated', handleTransactionUpdate);

		return () => {
			window.removeEventListener('transactionUpdated', handleTransactionUpdate);
		};
	}, [getCurrentMonthTransactions]);

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = async () => {
		try {
			const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Account', 'Description'];
			const rows = transactions.map(transaction => [
				new Date(transaction.date).toLocaleDateString(),
				transaction.title,
				transaction.category,
				transaction.type,
				transaction.type === 'EXPENSE' ? `-${transaction.amount}` : transaction.amount.toString(),
				transaction.bankAccount?.institution || 'N/A',
				transaction.description || ''
			]);

			const csvContent = [
				headers.join(','),
				...rows.map(row => row.join(','))
			].join('\n');

			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', `transactions-${format(selectedMonth, 'MMMM-yyyy')}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error downloading transactions:', error);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(prev => prev - 1);
		} else {
			setCurrentMonth(prev => prev - 1);
		}
	};

	const handlePreviousMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(prev => prev + 1);
		} else {
			setCurrentMonth(prev => prev + 1);
		}
	};

	const getCategoryIcon = (category: string) => {
		return categoryIcons[category.toLowerCase()] || categoryIcons.other;
	};

	return (
		<section className="rounded-xl bg-gray0 w-full p-7">
			<div className="flex justify-between items-center mb-7">
				<div className="flex items-center gap-4">
					<Select defaultValue="transactions">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Transactions type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="transactions">
								<div className="flex items-center gap-2">
									<Image src="/icons/transactions.svg" alt="transactions" width={20} height={20} />
									Transactions
								</div>
							</SelectItem>
							<SelectItem value="income">
								<div className="flex items-center gap-2">
									<Image src="/icons/income.svg" alt="income" width={20} height={20} />
									Income
								</div>
							</SelectItem>
							<SelectItem value="expense">
								<div className="flex items-center gap-2">
									<Image src="/icons/expenses.svg" alt="expense" width={20} height={20} />
									Expenses
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
					{selectedAccountId && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSelectedAccountId(null)}
							className="text-xs h-7"
						>
							Clear Account Filter
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<div className="flex gap-4">
						<Button variant="outline" onClick={handlePrint}>
							<Printer className="h-5 w-5" />
						</Button>

						<Button variant="default" onClick={handleDownload}>
							<FileDown className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>

			<div className="w-full relative">
				<div className="flex justify-between items-center mb-4">
					<button onClick={handleNextMonth} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
						<ChevronLeft className="h-6 w-6" />
					</button>
					<h2 className="text-lg font-medium">
						{months.find(m => m.month === currentMonth && m.year === currentYear)?.label || 'Loading...'}
					</h2>
					<button onClick={handlePreviousMonth} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
						<ChevronRight className="h-6 w-6" />
					</button>
				</div>

				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
					</div>
				) : (
					<div className="w-full">
						{transactions.length > 0 ? (
							<div className="space-y-2">
								{transactions.map((transaction) => (
									<div key={transaction.id} className="flex justify-between p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors">
										<div className="flex items-center gap-3">
											<Image
												src={getCategoryIcon(transaction.category)}
												alt={transaction.category}
												width={40}
												height={40}
												className="rounded-full"
											/>
											<div>
												<p className="font-medium">{transaction.title}</p>
												<p className="text-xs text-neutral-500">{new Date(transaction.date).toLocaleDateString()}</p>
												{transaction.bankAccount && (
													<p className="text-xs text-neutral-500">{transaction.bankAccount.institution}</p>
												)}
											</div>
										</div>
										<p className={clsx(
											"text-sm p-2 transition-all",
											transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500",
											{ "blur-sm": isHidden }
										)}>
											{transaction.type === "EXPENSE" ? "-" : "+"}
											{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-64 px-5">
								<Image src="/empty.svg" alt="empty" width={200} height={200} />
								<p className="text-center text-gray-500 py-4">No transactions found for this month.</p>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}