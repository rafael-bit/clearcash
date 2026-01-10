"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Printer, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import clsx from "clsx";
import { useVisibility } from "./VisibilityProvider";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/translations";

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
	investment: "/icons/investiments.svg",
	other: "/icons/expensesColor.svg",
};

const getCategoryOptions = (language: 'pt' | 'en'): Record<'INCOME' | 'EXPENSE', { value: string; label: string; icon: string }[]> => ({
	INCOME: [
		{ value: 'salary', label: t(language, 'Salary'), icon: '/icons/incomeColor.svg' },
		{ value: 'investment', label: t(language, 'Investment'), icon: '/icons/investiments.svg' },
		{ value: 'other', label: t(language, 'Other'), icon: '/icons/incomeColor.svg' },
	],
	EXPENSE: [
		{ value: 'food', label: t(language, 'Food'), icon: '/icons/food.svg' },
		{ value: 'home', label: t(language, 'Home'), icon: '/icons/house.svg' },
		{ value: 'education', label: t(language, 'Education'), icon: '/icons/education.svg' },
		{ value: 'leisure', label: t(language, 'Leisure'), icon: '/icons/leisure.svg' },
		{ value: 'market', label: t(language, 'Market'), icon: '/icons/market.svg' },
		{ value: 'clothing', label: t(language, 'Clothing'), icon: '/icons/clothing.svg' },
		{ value: 'health', label: t(language, 'Health'), icon: '/icons/health.svg' },
		{ value: 'transport', label: t(language, 'Transport'), icon: '/icons/transport.svg' },
		{ value: 'travel', label: t(language, 'Travel'), icon: '/icons/travel.svg' },
		{ value: 'other', label: t(language, 'Other'), icon: '/icons/expensesColor.svg' },
	],
});

const editFormSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
	description: z.string().optional(),
	amount: z.string().refine((val: string) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
		message: 'Amount must be a positive number.',
	}),
	type: z.enum(['INCOME', 'EXPENSE']),
	category: z.string().min(1, {
		message: 'Please select a category.',
	}),
	date: z.string().optional(),
});

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

export default function Details() {
	const { language } = useLanguage();
	const { isHidden } = useVisibility();
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [filterType, setFilterType] = useState<'transactions' | 'income' | 'expense'>('transactions');
	const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const editForm = useForm<z.infer<typeof editFormSchema>>({
		resolver: zodResolver(editFormSchema),
		defaultValues: {
			title: '',
			description: '',
			amount: '',
			type: 'EXPENSE',
			category: '',
			date: new Date().toISOString().split('T')[0],
		},
	});

	const getCurrentMonthLabel = useCallback(() => {
		return format(new Date(currentYear, currentMonth), 'MMMM yyyy');
	}, [currentMonth, currentYear]);

	const fetchTransactions = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/transactions?month=${currentMonth + 1}&year=${currentYear}`);
			if (!response.ok) throw new Error('Failed to fetch transactions');

			let data = await response.json();

			if (selectedAccountId) {
				data = data.filter((transaction: Transaction) => transaction.bankAccountId === selectedAccountId);
			}

			// Aplicar filtro de tipo (transactions, income, expense)
			if (filterType === 'income') {
				data = data.filter((transaction: Transaction) => transaction.type === 'INCOME');
			} else if (filterType === 'expense') {
				data = data.filter((transaction: Transaction) => transaction.type === 'EXPENSE');
			}

			setTransactions(data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setIsLoading(false);
		}
	}, [currentMonth, currentYear, selectedAccountId, filterType]);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	useEffect(() => {
		const handleTransactionUpdate = () => {
			fetchTransactions();
		};

		window.addEventListener('transactionUpdated', handleTransactionUpdate);

		return () => {
			window.removeEventListener('transactionUpdated', handleTransactionUpdate);
		};
	}, [fetchTransactions]);

	useEffect(() => {
		const handleAccountSelected = (event: CustomEvent<string>) => {
			setSelectedAccountId(event.detail);
		};

		window.addEventListener('accountSelected', handleAccountSelected as EventListener);

		return () => {
			window.removeEventListener('accountSelected', handleAccountSelected as EventListener);
		};
	}, []);

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
			link.setAttribute('download', `transactions-${format(new Date(currentYear, currentMonth), 'MMMM-yyyy')}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error downloading transactions:', error);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(prev => prev + 1);
		} else {
			setCurrentMonth(prev => prev + 1);
		}
	};

	const handlePreviousMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(prev => prev - 1);
		} else {
			setCurrentMonth(prev => prev - 1);
		}
	};

	const getCategoryIcon = (category: string) => {
		return categoryIcons[category.toLowerCase()] || categoryIcons.other;
	};

	const handleEdit = (transaction: Transaction) => {
		setEditingTransaction(transaction);
		editForm.reset({
			title: transaction.title,
			description: transaction.description || '',
			amount: transaction.amount.toString(),
			type: transaction.type,
			category: transaction.category,
			date: new Date(transaction.date).toISOString().split('T')[0],
		});
		setIsEditDialogOpen(true);
	};

	const handleDelete = async (transactionId: string) => {
		if (!confirm(t(language, 'Are you sure you want to delete this transaction?'))) {
			return;
		}

		try {
			setIsDeleting(transactionId);
			const response = await fetch(`/api/transactions/${transactionId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete transaction');

			toast.success(t(language, 'Transaction deleted successfully'));
			window.dispatchEvent(new Event('transactionUpdated'));
			window.dispatchEvent(new Event('accountUpdated'));
			fetchTransactions();
		} catch (error) {
			console.error('Error deleting transaction:', error);
			toast.error(t(language, 'Failed to delete transaction'));
		} finally {
			setIsDeleting(null);
		}
	};

	const handleEditSubmit = async (data: z.infer<typeof editFormSchema>) => {
		if (!editingTransaction) return;

		try {
			const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					bankAccountId: editingTransaction.bankAccountId,
				}),
			});

			if (!response.ok) throw new Error('Failed to update transaction');

			toast.success(t(language, 'Transaction updated successfully'));
			setIsEditDialogOpen(false);
			setEditingTransaction(null);
			window.dispatchEvent(new Event('transactionUpdated'));
			window.dispatchEvent(new Event('accountUpdated'));
			fetchTransactions();
		} catch (error) {
			console.error('Error updating transaction:', error);
			toast.error(t(language, 'Failed to update transaction'));
		}
	};

	return (
		<section className="rounded-xl bg-gray0 w-full p-7">
			<div className="flex justify-between items-center mb-7">
				<div className="flex items-center gap-4">
					<Select value={filterType} onValueChange={(value) => setFilterType(value as 'transactions' | 'income' | 'expense')}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t(language, 'Transactions type')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="transactions">
								<div className="flex items-center gap-2">
									<Image src="/icons/transactions.svg" alt="transactions" width={20} height={20} />
									{t(language, 'Transactions')}
								</div>
							</SelectItem>
							<SelectItem value="income">
								<div className="flex items-center gap-2">
									<Image src="/icons/income.svg" alt="income" width={20} height={20} />
									{t(language, 'Income')}
								</div>
							</SelectItem>
							<SelectItem value="expense">
								<div className="flex items-center gap-2">
									<Image src="/icons/expenses.svg" alt="expense" width={20} height={20} />
									{t(language, 'Expenses')}
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
							{t(language, 'Clear Account Filter')}
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
					<button onClick={handlePreviousMonth} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
						<ChevronLeft className="h-6 w-6" />
					</button>
					<h2 className="text-lg font-medium">
						{getCurrentMonthLabel()}
					</h2>
					<button onClick={handleNextMonth} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
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
									<div key={transaction.id} className="flex justify-between items-center p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors">
										<div className="flex items-center gap-3 flex-1">
											<Image
												src={getCategoryIcon(transaction.category)}
												alt={transaction.category}
												width={40}
												height={40}
												className="rounded-full"
											/>
											<div className="flex-1">
												<p className="font-medium">{transaction.title}</p>
												<p className="text-xs text-neutral-500">{new Date(transaction.date).toLocaleDateString()}</p>
												{transaction.bankAccount && (
													<p className="text-xs text-neutral-500">{transaction.bankAccount.institution}</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<p className={clsx(
												"text-sm p-2 transition-all",
												transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500",
												{ "blur-sm": isHidden }
											)}>
												{transaction.type === "EXPENSE" ? "-" : "+"}
												{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEdit(transaction)}
												className="h-8 w-8 p-0"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDelete(transaction.id)}
												disabled={isDeleting === transaction.id}
												className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-64 px-5">
								<Image src="/empty.svg" alt="empty" width={200} height={200} />
								<p className="text-center text-gray-500 py-4">{t(language, 'No transactions found for this month.')}</p>
							</div>
						)}
					</div>
				)}
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t(language, 'Edit Transaction')}</DialogTitle>
						<DialogDescription>
							{t(language, 'Update the transaction details below.')}
						</DialogDescription>
					</DialogHeader>
					<Form {...editForm}>
						<form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
							<FormField
								control={editForm.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Title')}</FormLabel>
										<FormControl>
											<Input placeholder={t(language, 'Title')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Description (Optional)')}</FormLabel>
										<FormControl>
											<Input placeholder={t(language, 'Description (Optional)')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Amount')}</FormLabel>
										<FormControl>
											<Input type="number" step="0.01" placeholder="0.00" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Type')}</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												className="flex gap-4"
											>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="INCOME" id="income" />
													<Label htmlFor="income">{t(language, 'Income')}</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="EXPENSE" id="expense" />
													<Label htmlFor="expense">{t(language, 'Expenses')}</Label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Category')}</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder={t(language, 'Category')} />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{getCategoryOptions(language)[editForm.watch('type') || 'EXPENSE'].map((category) => (
													<SelectItem key={category.value} value={category.value}>
														<div className="flex items-center gap-2">
															<Image src={category.icon} alt={category.label} width={20} height={20} />
															{category.label}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Date')}</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
									{t(language, 'Cancel')}
								</Button>
								<Button type="submit">{t(language, 'Save Changes')}</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</section>
	);
}