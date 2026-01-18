"use client";

import { Button } from "@/components/ui/button";
import { FileDown, FileText, Edit, Trash2, Paperclip, X, Upload, Images } from "lucide-react";
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
import { ptBR, enUS } from "date-fns/locale";
import { formatDate, dateToInputValue, isoToBrazilianFormat, brazilianToIsoFormat } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/translations";
import jsPDF from "jspdf";
import ImageGallery from "./ImageGallery";
import { normalizeDocumentUrl } from "@/lib/document-url";

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

const getDefaultCategoryOptions = (language: 'pt' | 'en'): Record<'INCOME' | 'EXPENSE', Array<{ value: string; label: string; icon: string }>> => ({
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

interface Document {
	id: string;
	url: string;
	fileName: string;
	mimeType: string;
	uploadedAt: string;
}

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
	documents?: Document[];
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
	const [editDocuments, setEditDocuments] = useState<Array<{ url: string; fileName: string; mimeType: string }>>([]);
	const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
	const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState<Record<'INCOME' | 'EXPENSE', { value: string; label: string; icon: string }[]>>({
		INCOME: getDefaultCategoryOptions(language).INCOME,
		EXPENSE: getDefaultCategoryOptions(language).EXPENSE,
	});

	const editForm = useForm<z.infer<typeof editFormSchema>>({
		resolver: zodResolver(editFormSchema),
		defaultValues: {
			title: '',
			description: '',
			amount: '',
			type: 'EXPENSE',
			category: '',
			date: dateToInputValue(new Date()),
		},
	});

	const getCurrentMonthLabel = useCallback(() => {
		return format(new Date(currentYear, currentMonth), 'MMMM yyyy', {
			locale: language === 'pt' ? ptBR : enUS
		});
	}, [currentMonth, currentYear, language]);

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
		loadCategoryOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchTransactions]);

	const loadCategoryOptions = async () => {
		try {
			const response = await fetch('/api/categories');
			if (response.ok) {
				const customCategories = await response.json();
				const defaultCategories = getDefaultCategoryOptions(language);
				
				const customIncome = customCategories
					.filter((cat: { type: string }) => cat.type === 'INCOME')
					.map((cat: { id: string; name: string; nameEn?: string; icon: string }) => ({
						value: `custom_${cat.id}`,
						label: language === 'pt' ? cat.name : (cat.nameEn || cat.name),
						icon: cat.icon,
					}));
				const customExpense = customCategories
					.filter((cat: { type: string }) => cat.type === 'EXPENSE')
					.map((cat: { id: string; name: string; nameEn?: string; icon: string }) => ({
						value: `custom_${cat.id}`,
						label: language === 'pt' ? cat.name : (cat.nameEn || cat.name),
						icon: cat.icon,
					}));
				
				setCategoryOptions({
					INCOME: [...customIncome, ...defaultCategories.INCOME],
					EXPENSE: [...customExpense, ...defaultCategories.EXPENSE],
				});
			}
		} catch (error) {
			console.error('Error loading custom categories:', error);
		}
	};

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

	const handleGeneratePDF = async () => {
		try {
			const doc = new jsPDF();
			const locale = language === 'pt' ? ptBR : enUS;
			
			// Título
			doc.setFontSize(18);
			doc.text(t(language, 'Transactions'), 14, 20);
			
			// Período
			doc.setFontSize(12);
			const monthLabel = format(new Date(currentYear, currentMonth), 'MMMM yyyy', { locale });
			doc.text(monthLabel, 14, 30);
			
			// Cabeçalho da tabela
			doc.setFontSize(10);
			let yPos = 45;
			const startX = 14;
			const colWidths = [30, 50, 30, 25, 35, 30];
			const headers = [
				t(language, 'Date'),
				t(language, 'Title'),
				t(language, 'Category'),
				t(language, 'Type'),
				t(language, 'Amount'),
				t(language, 'Account')
			];
			
			// Desenhar cabeçalho
			doc.setFillColor(240, 240, 240);
			doc.rect(startX, yPos - 5, 180, 8, 'F');
			doc.setTextColor(0, 0, 0);
			doc.setFont('helvetica', 'bold');
			
			let xPos = startX;
			headers.forEach((header, index) => {
				doc.text(header, xPos, yPos);
				xPos += colWidths[index];
			});
			
			// Linhas das transações
			doc.setFont('helvetica', 'normal');
			doc.setTextColor(0, 0, 0);
			yPos += 10;
			
			transactions.forEach((transaction, index) => {
				// Verificar se precisa de nova página
				if (yPos > 280) {
					doc.addPage();
					yPos = 20;
				}
				
				const dateStr = formatDate(transaction.date, language);
				const typeStr = transaction.type === 'INCOME' ? t(language, 'Income') : t(language, 'Expenses');
				const amountStr = transaction.type === 'EXPENSE' 
					? `-${new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(transaction.amount)}`
					: `+${new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(transaction.amount)}`;
				
				const accountStr = transaction.bankAccount?.institution || 'N/A';
				
				// Alternar cor de fundo
				if (index % 2 === 0) {
					doc.setFillColor(250, 250, 250);
					doc.rect(startX, yPos - 5, 180, 7, 'F');
				}
				
				// Desenhar linha
				doc.setDrawColor(200, 200, 200);
				doc.line(startX, yPos - 5, startX + 180, yPos - 5);
				
				// Texto da transação
				xPos = startX;
				const rowData = [
					dateStr,
					transaction.title.length > 20 ? transaction.title.substring(0, 20) + '...' : transaction.title,
					transaction.category.length > 15 ? transaction.category.substring(0, 15) + '...' : transaction.category,
					typeStr,
					amountStr,
					accountStr.length > 15 ? accountStr.substring(0, 15) + '...' : accountStr
				];
				
				rowData.forEach((data, colIndex) => {
					doc.text(data, xPos, yPos);
					xPos += colWidths[colIndex];
				});
				
				yPos += 7;
			});
			
			// Totais
			if (transactions.length > 0) {
				yPos += 5;
				doc.setDrawColor(0, 0, 0);
				doc.line(startX, yPos, startX + 180, yPos);
				yPos += 10;
				
				const totalIncome = transactions
					.filter(t => t.type === 'INCOME')
					.reduce((sum, t) => sum + t.amount, 0);
				const totalExpense = transactions
					.filter(t => t.type === 'EXPENSE')
					.reduce((sum, t) => sum + t.amount, 0);
				const balance = totalIncome - totalExpense;
				
				doc.setFont('helvetica', 'bold');
				doc.text(`${t(language, 'Income')}: ${new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
					style: 'currency', 
					currency: 'USD' 
				}).format(totalIncome)}`, startX, yPos);
				yPos += 7;
				doc.text(`${t(language, 'Expenses')}: ${new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
					style: 'currency', 
					currency: 'USD' 
				}).format(totalExpense)}`, startX, yPos);
				yPos += 7;
				doc.setFont('helvetica', 'bold');
				doc.text(`${t(language, 'Balance')}: ${new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
					style: 'currency', 
					currency: 'USD' 
				}).format(balance)}`, startX, yPos);
			}
			
			// Salvar PDF
			const fileName = `transactions-${format(new Date(currentYear, currentMonth), 'MMMM-yyyy', { locale }).toLowerCase()}.pdf`;
			doc.save(fileName);
			
			toast.success(language === 'pt' ? 'PDF gerado com sucesso!' : 'PDF generated successfully!');
		} catch (error) {
			console.error('Error generating PDF:', error);
			toast.error(language === 'pt' ? 'Erro ao gerar PDF' : 'Error generating PDF');
		}
	};

	const handleDownload = async () => {
		try {
			const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Account', 'Description'];
			const rows = transactions.map(transaction => [
				formatDate(transaction.date, language),
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
			link.setAttribute('download', `transactions-${format(new Date(currentYear, currentMonth), 'MMMM-yyyy', {
				locale: language === 'pt' ? ptBR : enUS
			})}.csv`);
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

	const getCategoryIcon = (category: string, type?: 'INCOME' | 'EXPENSE') => {
		// Verificar se é uma categoria customizada (pode vir com ou sem prefixo)
		const categoryId = category.startsWith('custom_') ? category.replace('custom_', '') : category;
		const allCategories = [...categoryOptions.INCOME, ...categoryOptions.EXPENSE];
		const customCat = allCategories.find(cat => {
			const catId = cat.value.startsWith('custom_') ? cat.value.replace('custom_', '') : cat.value;
			return catId === categoryId;
		});
		if (customCat) {
			return customCat.icon;
		}
		
		const categoryLower = category.toLowerCase();
		// Se for "other", usar o ícone baseado no tipo da transação
		if (categoryLower === 'other') {
			if (type === 'INCOME') {
				return '/icons/incomeColor.svg';
			}
			return '/icons/expensesColor.svg';
		}
		return categoryIcons[categoryLower] || (type === 'INCOME' ? '/icons/incomeColor.svg' : '/icons/expensesColor.svg');
	};

	const handleEdit = async (transaction: Transaction) => {
		setEditingTransaction(transaction);
		
		// Carregar categorias customizadas antes de definir o valor
		await loadCategoryOptions();
		
		// Verificar se a categoria é customizada
		let categoryValue = transaction.category;
		const allCategories = [...categoryOptions.INCOME, ...categoryOptions.EXPENSE];
		const customCat = allCategories.find(cat => {
			const catId = cat.value.startsWith('custom_') ? cat.value.replace('custom_', '') : cat.value;
			return catId === transaction.category;
		});
		
		if (customCat) {
			categoryValue = customCat.value;
		}
		
		editForm.reset({
			title: transaction.title,
			description: transaction.description || '',
			amount: transaction.amount.toString(),
			type: transaction.type,
			category: categoryValue,
			date: dateToInputValue(transaction.date),
		});
		setEditDocuments(transaction.documents?.map(doc => ({
			url: doc.url,
			fileName: doc.fileName,
			mimeType: doc.mimeType,
		})) || []);
		setIsEditDialogOpen(true);
	};

	const handleFileUpload = async (file: File) => {
		const fileId = `${Date.now()}-${Math.random()}`;
		setUploadingFiles((prev) => new Set(prev).add(fileId));

		try {
			const formData = new FormData();
			formData.append('file', file);

			const uploadResponse = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!uploadResponse.ok) {
				const error = await uploadResponse.json();
				throw new Error(error.error || 'Failed to upload file');
			}

			const { url, fileName, mimeType } = await uploadResponse.json();

			setEditDocuments((prev) => [
				...prev,
				{
					url,
					fileName,
					mimeType,
				},
			]);

			toast.success(t(language, 'File uploaded successfully.'));
		} catch (error) {
			console.error('Error uploading file:', error);
			toast.error(error instanceof Error ? error.message : t(language, 'Failed to upload file. Please try again.'));
		} finally {
			setUploadingFiles((prev) => {
				const next = new Set(prev);
				next.delete(fileId);
				return next;
			});
		}
	};

	const removeEditDocument = (index: number) => {
		setEditDocuments((prev) => prev.filter((_, i) => i !== index));
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
			// Se a categoria começar com "custom_", remover o prefixo
			const categoryValue = data.category.startsWith('custom_') 
				? data.category.replace('custom_', '') 
				: data.category;
			
			const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					category: categoryValue,
					bankAccountId: editingTransaction.bankAccountId,
					documents: editDocuments.length > 0 ? editDocuments : [],
				}),
			});

			if (!response.ok) throw new Error('Failed to update transaction');

			toast.success(t(language, 'Transaction updated successfully'));
			setIsEditDialogOpen(false);
			setEditingTransaction(null);
			setEditDocuments([]);
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
						<Button variant="outline" onClick={() => setIsImageGalleryOpen(true)}>
							<Images className="h-5 w-5 mr-2" />
							{t(language, 'View Images')}
						</Button>

						<Button variant="outline" onClick={handleGeneratePDF}>
							<FileText className="h-5 w-5 mr-2" />
							{t(language, 'Generate PDF')}
						</Button>

						<Button variant="default" onClick={handleDownload}>
							<FileDown className="h-5 w-5 mr-2" />
							{t(language, 'Download CSV')}
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
												src={getCategoryIcon(transaction.category, transaction.type)}
												alt={transaction.category}
												width={40}
												height={40}
												className="rounded-full"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<p className="font-medium">{transaction.title}</p>
													{transaction.documents && transaction.documents.length > 0 && (
														<Paperclip className="h-4 w-4 text-gray-400" />
													)}
												</div>
												<p className="text-xs text-neutral-500">
													{formatDate(transaction.date, language)}
												</p>
												{transaction.bankAccount && (
													<p className="text-xs text-neutral-500">{transaction.bankAccount.institution}</p>
												)}
												{transaction.documents && transaction.documents.length > 0 && (
													<div className="flex gap-2 mt-1">
														{transaction.documents.map((doc, idx) => (
															<a
																key={idx}
																href={normalizeDocumentUrl(doc.url)}
																target="_blank"
																rel="noopener noreferrer"
																className="text-xs text-blue-500 hover:text-blue-700 underline"
															>
																{doc.fileName}
															</a>
														))}
													</div>
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
												{categoryOptions[editForm.watch('type') || 'EXPENSE'].map((category) => (
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
								render={({ field }) => {
									const isoDate = field.value || dateToInputValue(new Date());
									// Converter para formato brasileiro para exibição
									const displayValue = language === 'pt' 
										? isoToBrazilianFormat(isoDate)
										: isoDate;
									
									return (
										<FormItem>
											<FormLabel>{t(language, 'Date')}</FormLabel>
											<FormControl>
												<div className="relative">
													{language === 'pt' ? (
														<>
															<Input 
																type="text"
																placeholder="DD/MM/AAAA"
																value={displayValue}
																onChange={(e) => {
																	const input = e.target.value;
																	// Permitir apenas números e barras
																	const cleaned = input.replace(/[^\d/]/g, '');
																	// Aplicar máscara DD/MM/YYYY
																	let masked = cleaned;
																	if (cleaned.length > 2 && !cleaned.includes('/')) {
																		masked = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
																	}
																	if (masked.length > 5) {
																		masked = masked.slice(0, 5) + '/' + masked.slice(5, 9);
																	}
																	
																	// Atualizar o valor exibido
																	e.target.value = masked;
																	
																	// Converter para ISO quando tiver formato completo
																	if (masked.length === 10) {
																		const iso = brazilianToIsoFormat(masked);
																		if (iso && iso.match(/^\d{4}-\d{2}-\d{2}$/)) {
																			field.onChange(iso);
																		}
																	}
																}}
																onBlur={(e) => {
																	const input = e.target.value;
																	if (input.length === 10) {
																		const iso = brazilianToIsoFormat(input);
																		if (iso && iso.match(/^\d{4}-\d{2}-\d{2}$/)) {
																			field.onChange(iso);
																		} else {
																			// Se formato inválido, manter o valor atual do campo
																			const currentIso = field.value || dateToInputValue(new Date());
																			field.onChange(currentIso);
																		}
																	} else if (input.length > 0 && input.length < 10) {
																		// Se não estiver completo, manter o valor atual do campo
																		const currentIso = field.value || dateToInputValue(new Date());
																		field.onChange(currentIso);
																	}
																	field.onBlur();
																}}
																name={field.name}
																ref={field.ref}
																maxLength={10}
																className="pr-12"
															/>
															<Input
																type="date"
																value={isoDate}
																onChange={(e) => {
																	field.onChange(e.target.value);
																}}
																className="absolute opacity-0 pointer-events-none w-0 h-0"
																tabIndex={-1}
																aria-hidden="true"
															/>
														</>
													) : (
														<Input 
															type="date" 
															value={isoDate}
															onChange={(e) => {
																field.onChange(e.target.value);
															}}
															onBlur={field.onBlur}
															name={field.name}
															ref={field.ref}
															lang="en-US"
														/>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<div className="space-y-2">
								<FormLabel>{t(language, 'Documents')} (Receipts, Invoices, etc.)</FormLabel>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
									<input
										type="file"
										accept="image/*,application/pdf"
										multiple
										onChange={(e) => {
											const files = Array.from(e.target.files || []);
											files.forEach((file) => handleFileUpload(file));
										}}
										className="hidden"
										id="edit-document-upload"
										disabled={uploadingFiles.size > 0}
									/>
									<label
										htmlFor="edit-document-upload"
										className="flex flex-col items-center justify-center cursor-pointer"
									>
										<Upload className="h-8 w-8 text-gray-400 mb-2" />
										<span className="text-sm text-gray-600">
											{uploadingFiles.size > 0
												? t(language, 'Uploading...')
												: t(language, 'Click to upload or drag and drop')}
										</span>
										<span className="text-xs text-gray-400 mt-1">
											{t(language, 'Images (JPEG, PNG, GIF, WebP) or PDF (max 10MB)')}
										</span>
									</label>
								</div>
								{editDocuments.length > 0 && (
									<div className="space-y-2">
										{editDocuments.map((doc, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
											>
												<div className="flex items-center gap-2 flex-1 min-w-0">
													{doc.mimeType.startsWith('image/') ? (
														<img
															src={normalizeDocumentUrl(doc.url)}
															alt={doc.fileName}
															className="w-8 h-8 object-cover rounded"
															onError={(e) => {
																console.error('Error loading image:', doc.url);
																(e.target as HTMLImageElement).style.display = 'none';
															}}
														/>
													) : (
														<FileText className="h-8 w-8 text-gray-400" />
													)}
													<a
														href={normalizeDocumentUrl(doc.url)}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm text-blue-500 hover:text-blue-700 underline truncate flex-1"
													>
														{doc.fileName}
													</a>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeEditDocument(index)}
													className="h-8 w-8 p-0"
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
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

			<ImageGallery
				isOpen={isImageGalleryOpen}
				onClose={() => setIsImageGalleryOpen(false)}
			/>
		</section>
	);
}