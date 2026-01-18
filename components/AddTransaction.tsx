"use client"

import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Minus, PlusCircle, X, Upload, FileText } from 'lucide-react'
import Image from 'next/image'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useModal } from './ModalProvider'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from './LanguageProvider'
import { t } from '@/lib/translations'
import { normalizeDocumentUrl } from '@/lib/document-url'
import { dateToInputValue, isoToBrazilianFormat, brazilianToIsoFormat } from '@/lib/utils'

const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
	amount: z.string().refine((val: string) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
		message: 'Amount must be a positive number.',
	}),
	type: z.enum(['INCOME', 'EXPENSE']),
	category: z.string().min(1, {
		message: 'Please select a category.',
	}),
	bankAccountId: z.string().optional(),
	date: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof formSchema>;

const accountFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Account name must be at least 2 characters.',
	}),
	institution: z.string().min(2, {
		message: 'Institution name must be at least 2 characters.',
	}),
	type: z.enum(['BANK', 'INVESTMENT', 'WALLET']),
	currency: z.string().default('USD'),
	balance: z.string().refine((val: string) => !isNaN(parseFloat(val)), {
		message: 'Balance must be a valid number.',
	}),
	color: z.string().default('#0ea5e9'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>;

type BankAccount = {
	id: string
	name: string
	institution: string
	balance: number
	type: 'BANK' | 'INVESTMENT' | 'WALLET'
	currency: string
	color: string
}

type Category = {
	value: string
	label: string
	icon: string
}

type AccountTypeOption = {
	value: string
	label: string
	icon: string
}

const getDefaultCategoryOptions = (language: 'pt' | 'en'): Record<'INCOME' | 'EXPENSE', Category[]> => ({
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
})


const accountTypeOptions: AccountTypeOption[] = [
	{ value: 'BANK', label: 'Bank Account', icon: '/icons/cardGray.svg' },
	{ value: 'INVESTMENT', label: 'Investment', icon: '/icons/investiments.svg' },
	{ value: 'WALLET', label: 'Wallet', icon: '/icons/wallet.svg' },
]

export default function AddTransaction() {
	const { language } = useLanguage()
	const {
		isOpen,
		setIsOpen,
		setShowAccountForm,
		isAccountModalOpen,
		setIsAccountModalOpen
	} = useModal()
	const [accounts, setAccounts] = useState<BankAccount[]>([])
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showAll, setShowAll] = useState(false)
	const [documents, setDocuments] = useState<Array<{ url: string; fileName: string; mimeType: string }>>([])
	const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
	const [categoryOptions, setCategoryOptions] = useState<Record<'INCOME' | 'EXPENSE', Category[]>>({
		INCOME: getDefaultCategoryOptions(language).INCOME,
		EXPENSE: getDefaultCategoryOptions(language).EXPENSE,
	})

	// Inicializar a data atual uma vez
	const getInitialDate = () => dateToInputValue(new Date());
	
	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			amount: '',
			type: 'EXPENSE',
			category: '',
			bankAccountId: '',
			date: getInitialDate(),
		},
	})

	const accountForm = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
			name: '',
			institution: '',
			type: 'BANK',
			currency: 'USD',
			balance: '0',
			color: '#0ea5e9',
		},
	})

	const transactionType = form.watch('type') as 'INCOME' | 'EXPENSE'
	const currentDate = form.watch('date')
	
	useEffect(() => {
		form.setValue('category', '')
	}, [transactionType, form])
	
	// Garantir que a data sempre tenha um valor válido
	useEffect(() => {
		if (!currentDate || currentDate === '') {
			const today = dateToInputValue(new Date())
			form.setValue('date', today, { shouldValidate: false })
		}
	}, [currentDate, form])

	const fetchAccounts = useCallback(async () => {
		try {
			const response = await fetch('/api/bank-accounts')
			if (!response.ok) throw new Error('Failed to fetch accounts')

			const data = await response.json()
			setAccounts(data)

			if (data.length === 0) {
				setShowAccountForm(true)
			} else {
				// Usar a conta selecionada se existir, senão usar a primeira conta
				const accountToUse = selectedAccountId && data.find((acc: BankAccount) => acc.id === selectedAccountId)
					? selectedAccountId
					: data[0].id
				form.setValue('bankAccountId', accountToUse)
				setShowAccountForm(false)
			}
		} catch (error) {
			console.error('Error fetching accounts:', error)
		}
	}, [setShowAccountForm, form, selectedAccountId])

	// Escutar eventos de seleção de conta
	useEffect(() => {
		const handleAccountSelected = (event: CustomEvent<string>) => {
			const accountId = event.detail
			setSelectedAccountId(accountId)
			
			// Se o modal estiver aberto e a conta existir na lista, atualizar o formulário
			if (isOpen && accounts.length > 0) {
				const accountExists = accounts.find(acc => acc.id === accountId)
				if (accountExists) {
					form.setValue('bankAccountId', accountId)
				}
			}
		}

		window.addEventListener('accountSelected', handleAccountSelected as EventListener)

		return () => {
			window.removeEventListener('accountSelected', handleAccountSelected as EventListener)
		}
	}, [isOpen, accounts, form])

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
		if (isOpen) {
			fetchAccounts()
			loadCategoryOptions()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, fetchAccounts])

	// Atualizar a data quando o modal é aberto
	useEffect(() => {
		if (isOpen) {
			// Usar setTimeout para garantir que o DOM está pronto
			setTimeout(() => {
				const today = dateToInputValue(new Date())
				form.setValue('date', today, { shouldValidate: false, shouldDirty: false })
			}, 0)
		}
	}, [isOpen, form])

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

			// Adicionar documento à lista
			setDocuments((prev) => [
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

	const removeDocument = (index: number) => {
		setDocuments((prev) => prev.filter((_, i) => i !== index));
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			setIsSubmitting(true);
			// Se a categoria começar com "custom_", remover o prefixo
			const categoryValue = data.category.startsWith('custom_') 
				? data.category.replace('custom_', '') 
				: data.category;
			
			const response = await fetch('/api/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					category: categoryValue,
					documents: documents.length > 0 ? documents : undefined,
				}),
			});

			if (!response.ok) throw new Error('Failed to create transaction');

			toast.success(t(language, 'Transaction created successfully.'))

			// Manter a conta selecionada ao resetar, se existir
			const accountToUse = selectedAccountId && accounts.find(acc => acc.id === selectedAccountId)
				? selectedAccountId
				: accounts.length > 0 ? accounts[0].id : ''
			
			form.reset({
				title: '',
				amount: '',
				type: 'EXPENSE',
				category: '',
				bankAccountId: accountToUse,
				date: dateToInputValue(new Date()),
			});
			setDocuments([]);
			setIsOpen(false);
			window.dispatchEvent(new Event('transactionUpdated'));
			window.dispatchEvent(new Event('accountUpdated'));
		} catch (error) {
			console.error('Error creating transaction:', error);
			toast.error(t(language, 'Failed to create transaction. Please try again.'))
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmitAccount = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			const values = accountForm.getValues();
			const response = await fetch('/api/bank-accounts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) throw new Error('Failed to create account');

			toast.success(t(language, 'Account created successfully.'))

			accountForm.reset();
			setShowAccountForm(false);
			window.dispatchEvent(new Event('accountUpdated'));
		} catch (error) {
			console.error('Error creating account:', error);
			toast.error(t(language, 'Failed to create account. Please try again.'))
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{t(language, 'Add Transaction')}</DialogTitle>
						<DialogDescription>
							{t(language, 'Record a new transaction to keep track of your finances.')}
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Transaction Type')}</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex"
											>
												<div className="flex items-center space-x-2 bg-red-100 p-2 rounded-l-md flex-1 justify-center">
													<RadioGroupItem value="EXPENSE" id="expense" className="text-red-500 sr-only" />
													<Label htmlFor="expense" className="flex items-center cursor-pointer text-red-500">
														<Minus className="h-4 w-4 mr-1" />
														{t(language, 'Expense')}
													</Label>
												</div>
												<div className="flex items-center space-x-2 bg-green-100 p-2 rounded-r-md flex-1 justify-center">
													<RadioGroupItem value="INCOME" id="income" className="text-green-500 sr-only" />
													<Label htmlFor="income" className="flex items-center cursor-pointer text-green-500">
														<Plus className="h-4 w-4 mr-1" />
														{t(language, 'Income')}
													</Label>
												</div>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
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
									control={form.control}
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
							</div>

							<FormField
								control={form.control}
								name="category"
								render={({ field }) => {
									const categories = categoryOptions[transactionType];
									const visibleCategories = showAll ? categories : categories.slice(0, 7);

									return (
										<FormItem>
											<FormLabel>{t(language, 'Category')}</FormLabel>
											<FormControl>
												<div className="grid grid-cols-4 gap-2">
													{visibleCategories.map((category) => (
														<div
															key={category.value}
															onClick={() => form.setValue("category", category.value)}
															className={`flex flex-col items-center p-2 border rounded-md cursor-pointer ${field.value === category.value
																? "border-primary bg-primary/10"
																: "border-gray-200"
																}`}
														>
															<Image src={category.icon} alt={category.label} width={24} height={24} />
															<span className="text-xs mt-1">{category.label}</span>
														</div>
													))}
													{categories.length > 7 && (
														<div
															onClick={() => setShowAll(!showAll)}
															className="flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200"
														>
															<MoreHorizontal className="h-6 w-6 text-gray-600" />
															<span className="text-xs mt-1">{showAll ? t(language, 'Show Less') : t(language, 'Show More')}</span>
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<div>
								<div className="flex justify-between items-center mb-2">
									<FormLabel>{t(language, 'Account')}</FormLabel>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setShowAccountForm(true)}
										className="text-xs flex items-center h-6 py-1 px-2"
									>
										<PlusCircle className="h-3 w-3 mr-1" />
										{t(language, 'Add Account')}
									</Button>
								</div>

								{accounts.length > 0 ? (
									<FormField
										control={form.control}
										name="bankAccountId"
										render={({ field }) => (
											<FormItem>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder={t(language, 'Select account')} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{accounts.map((account) => (
															<SelectItem key={account.id} value={account.id}>
																<div className="flex items-center">
																	<div
																		className="w-3 h-3 rounded-full mr-2"
																		style={{ backgroundColor: account.color }}
																	/>
																	{account.name} ({account.institution})
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								) : (
									<div className="text-sm text-gray-500 p-2 bg-gray-100 rounded-md">
										{t(language, 'No accounts yet. Please add an account first.')}
									</div>
								)}
							</div>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => {
									// Garantir que sempre temos um valor válido
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
										id="document-upload"
										disabled={uploadingFiles.size > 0}
									/>
									<label
										htmlFor="document-upload"
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
								{documents.length > 0 && (
									<div className="space-y-2">
										{documents.map((doc, index) => (
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
													<span className="text-sm text-gray-700 truncate flex-1">
														{doc.fileName}
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeDocument(index)}
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
								<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
									{t(language, 'Cancel')}
								</Button>
								<Button type="submit" disabled={isSubmitting || accounts.length === 0}>
									{isSubmitting ? t(language, 'Saving...') : t(language, 'Save Transaction')}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{t(language, 'Add Account')}</DialogTitle>
						<DialogDescription>
							{t(language, 'Create a new account to manage your finances.')}
						</DialogDescription>
					</DialogHeader>

					<Form {...accountForm}>
						<form onSubmit={onSubmitAccount} className="space-y-6">
							<FormField
								control={accountForm.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Account Type')}</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
											>
												{accountTypeOptions.map((option) => (
													<FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value={option.value} />
														</FormControl>
														<FormLabel className="flex items-center cursor-pointer">
															<Image src={option.icon} alt={option.label} width={20} height={20} className="mr-2" />
															{option.label}
														</FormLabel>
													</FormItem>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={accountForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t(language, 'Account Name')}</FormLabel>
											<FormControl>
												<Input placeholder={t(language, 'Account Name')} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={accountForm.control}
									name="institution"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t(language, 'Institution')}</FormLabel>
											<FormControl>
												<Input placeholder={t(language, 'Institution')} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={accountForm.control}
								name="balance"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Current Balance')}</FormLabel>
										<FormControl>
											<Input type="number" step="0.01" placeholder="0.00" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={accountForm.control}
								name="currency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Currency')}</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder={t(language, 'Select currency')} />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="USD">USD - US Dollar</SelectItem>
												<SelectItem value="EUR">EUR - Euro</SelectItem>
												<SelectItem value="GBP">GBP - British Pound</SelectItem>
												<SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
												<SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={accountForm.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t(language, 'Account Color')}</FormLabel>
										<FormControl>
											<div className="flex items-center gap-4">
												<div className="relative">
													<input
														type="color"
														value={field.value}
														onChange={(e) => field.onChange(e.target.value)}
														className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
														style={{ backgroundColor: field.value }}
													/>
												</div>
												<div className="flex flex-col gap-1">
													<p className="text-sm text-gray-600">{field.value}</p>
													<div 
														className="w-24 h-8 rounded border-2 border-gray-300"
														style={{ backgroundColor: field.value }}
													/>
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => {
									setShowAccountForm(false)
									if (accounts.length === 0) {
										setIsOpen(false)
									}
								}}>
									{t(language, 'Cancel')}
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? t(language, 'Creating...') : t(language, 'Create Account')}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-5 right-5 bg-teal9 hover:bg-teal-800 transition-all duration-300 rounded-full w-14 h-14 text-white p-3 flex items-center justify-center shadow-lg z-50"
				size="icon"
			>
				<Plus className="h-6 w-6" />
			</Button>
		</>
	)
}
