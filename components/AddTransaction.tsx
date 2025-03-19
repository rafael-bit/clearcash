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
import { Plus, Minus, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useModal } from './ModalProvider'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

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

const categoryOptions: Record<'INCOME' | 'EXPENSE', Category[]> = {
	INCOME: [
		{ value: 'salary', label: 'Salary', icon: '/icons/incomeColor.svg' },
		{ value: 'investment', label: 'Investment', icon: '/icons/investiments.svg' },
		{ value: 'other', label: 'Other', icon: '/icons/incomeColor.svg' },
	],
	EXPENSE: [
		{ value: 'food', label: 'Food', icon: '/icons/food.svg' },
		{ value: 'home', label: 'Home', icon: '/icons/house.svg' },
		{ value: 'education', label: 'Education', icon: '/icons/education.svg' },
		{ value: 'leisure', label: 'Leisure', icon: '/icons/leisure.svg' },
		{ value: 'market', label: 'Market', icon: '/icons/market.svg' },
		{ value: 'clothing', label: 'Clothing', icon: '/icons/clothing.svg' },
		{ value: 'health', label: 'Health', icon: '/icons/health.svg' },
		{ value: 'transport', label: 'Transport', icon: '/icons/transport.svg' },
		{ value: 'travel', label: 'Travel', icon: '/icons/travel.svg' },
		{ value: 'other', label: 'Other', icon: '/icons/expensesColor.svg' },
	],
}

const accountTypeOptions: AccountTypeOption[] = [
	{ value: 'BANK', label: 'Bank Account', icon: '/icons/cardGray.svg' },
	{ value: 'INVESTMENT', label: 'Investment', icon: '/icons/investiments.svg' },
	{ value: 'WALLET', label: 'Wallet', icon: '/icons/wallet.svg' },
]

const colorOptions: string[] = [
	'#0ea5e9', // blue
	'#10b981', // green
	'#f59e0b', // yellow
	'#ef4444', // red
	'#8b5cf6', // purple
	'#ec4899', // pink
	'#000000', // black
]

export default function AddTransaction() {
	const {
		isOpen,
		setIsOpen,
		showAccountForm,
		setShowAccountForm,
		isAccountModalOpen,
		setIsAccountModalOpen
	} = useModal()
	const [accounts, setAccounts] = useState<BankAccount[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showAll, setShowAll] = useState(false)

	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			amount: '',
			type: 'EXPENSE',
			category: '',
			bankAccountId: '',
			date: new Date().toISOString().split('T')[0],
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
	useEffect(() => {
		form.setValue('category', '')
	}, [transactionType, form])

	const fetchAccounts = useCallback(async () => {
		try {
			const response = await fetch('/api/bank-accounts')
			if (!response.ok) throw new Error('Failed to fetch accounts')

			const data = await response.json()
			setAccounts(data)

			if (data.length === 0) {
				setShowAccountForm(true)
			} else {
				form.setValue('bankAccountId', data[0].id)
				setShowAccountForm(false)
			}
		} catch (error) {
			console.error('Error fetching accounts:', error)
		}
	}, [setShowAccountForm, form])

	useEffect(() => {
		if (isOpen) {
			fetchAccounts()
		}
	}, [isOpen, fetchAccounts])

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			setIsSubmitting(true);
			const response = await fetch('/api/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) throw new Error('Failed to create transaction');

			toast.success("Transaction created successfully.")

			form.reset();
			setIsOpen(false);
			window.dispatchEvent(new Event('transactionUpdated'));
			window.dispatchEvent(new Event('accountUpdated'));
		} catch (error) {
			console.error('Error creating transaction:', error);
			toast.error("Failed to create transaction. Please try again.")
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

			toast.success("Account created successfully.")

			accountForm.reset();
			setShowAccountForm(false);
			window.dispatchEvent(new Event('accountUpdated'));
		} catch (error) {
			console.error('Error creating account:', error);
			toast.error("Failed to create account. Please try again.")
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Add Transaction</DialogTitle>
						<DialogDescription>
							Record a new transaction to keep track of your finances.
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transaction Type</FormLabel>
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
														Expense
													</Label>
												</div>
												<div className="flex items-center space-x-2 bg-green-100 p-2 rounded-r-md flex-1 justify-center">
													<RadioGroupItem value="INCOME" id="income" className="text-green-500 sr-only" />
													<Label htmlFor="income" className="flex items-center cursor-pointer text-green-500">
														<Plus className="h-4 w-4 mr-1" />
														Income
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
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Grocery Shopping" {...field} />
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
											<FormLabel>Amount</FormLabel>
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
											<FormLabel>Category</FormLabel>
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
															<span className="text-xs mt-1">{showAll ? "Show Less" : "Show More"}</span>
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
									<FormLabel>Account</FormLabel>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setShowAccountForm(true)}
										className="text-xs flex items-center h-6 py-1 px-2"
									>
										<PlusCircle className="h-3 w-3 mr-1" />
										Add Account
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
															<SelectValue placeholder="Select account" />
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
										No accounts yet. Please add an account first.
									</div>
								)}
							</div>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting || accounts.length === 0}>
									{isSubmitting ? 'Saving...' : 'Save Transaction'}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Add Account</DialogTitle>
						<DialogDescription>
							Create a new account to manage your finances.
						</DialogDescription>
					</DialogHeader>

					<Form {...accountForm}>
						<form onSubmit={onSubmitAccount} className="space-y-6">
							<FormField
								control={accountForm.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Type</FormLabel>
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
											<FormLabel>Account Name</FormLabel>
											<FormControl>
												<Input placeholder="e.g. My Checking Account" {...field} />
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
											<FormLabel>Institution</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Chase Bank" {...field} />
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
										<FormLabel>Current Balance</FormLabel>
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
										<FormLabel>Currency</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select currency" />
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
										<FormLabel>Account Color</FormLabel>
										<FormControl>
											<div className="flex flex-wrap gap-2">
												{colorOptions.map((color) => (
													<div
														key={color}
														onClick={() => accountForm.setValue('color', color)}
														className={`w-8 h-8 rounded-full cursor-pointer border-2 ${field.value === color ? 'border-black' : 'border-transparent'
															}`}
														style={{ backgroundColor: color }}
													/>
												))}
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
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? 'Creating...' : 'Create Account'}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{!showAccountForm && (
				<Button
					onClick={() => setIsOpen(true)}
					className="fixed bottom-5 right-5 bg-teal9 hover:bg-teal-800 transition-all duration-300 rounded-full w-12 h-12 text-white p-3 flex items-center justify-center"
					size="icon"
				>
					<Plus className="h-6 w-6" />
				</Button>
			)}
		</>
	)
}
