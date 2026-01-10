'use client'

import { useEffect, useState, useCallback } from 'react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import clsx from "clsx"
import { useVisibility } from "./VisibilityProvider"
import { PlusCircle } from 'lucide-react'
import { useModal } from './ModalProvider'
import { useLanguage } from './LanguageProvider'
import { t } from '@/lib/translations'

type BankAccount = {
	id: string
	name: string
	institution: string
	balance: number
	type: 'BANK' | 'INVESTMENT' | 'WALLET'
	currency: string
	color: string
	createdAt: string
	updatedAt: string
}

export default function MyAccounts() {
	const { language } = useLanguage()
	const { openAccountModal } = useModal()
	const { isHidden } = useVisibility()
	const [accounts, setAccounts] = useState<BankAccount[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

	const fetchAccounts = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await fetch('/api/bank-accounts')
			if (!response.ok) throw new Error('Failed to fetch accounts')

			const data = await response.json()
			setAccounts(data)
		} catch (error) {
			console.error('Error fetching accounts:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchAccounts()
	}, [fetchAccounts])

	useEffect(() => {
		const handleAccountUpdate = () => {
			fetchAccounts()
		}

		window.addEventListener('accountUpdated', handleAccountUpdate)

		return () => {
			window.removeEventListener('accountUpdated', handleAccountUpdate)
		}
	}, [fetchAccounts])

	const getAccountIcon = (type: string) => {
		switch (type) {
			case 'BANK':
				return "/icons/cardGray.svg"
			case 'INVESTMENT':
				return "/icons/investiments.svg"
			case 'WALLET':
				return "/icons/wallet.svg"
			default:
				return "/icons/cardGray.svg"
		}
	}

	const handleAccountClick = (accountId: string) => {
		setSelectedAccountId(accountId)
		const event = new CustomEvent('accountSelected', { detail: accountId })
		window.dispatchEvent(event)
	}

	const handleCreateAccount = () => {
		openAccountModal()
	}

	return (
		<section className="w-full">
			<div className="flex justify-between items-center text-white w-full mb-4">
				<p className="text-lg font-semibold">{t(language, 'My accounts')}</p>
			</div>
			{isLoading ? (
				<div className="flex justify-center items-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
				</div>
			) : accounts.length > 0 ? (
				<Carousel
					opts={{
						align: "start",
						loop: false,
					}}
					className="w-full relative"
				>
					<div className="absolute right-9 -top-7 flex gap-2">
						<CarouselPrevious className="text-white hover:text-white h-10 w-10 border-none shadow-none bg-transparent hover:bg-green-500/30 rounded-full transition-all duration-300" />
						<CarouselNext className="text-white hover:text-white h-10 w-10 border-none shadow-none bg-transparent hover:bg-green-500/30 rounded-full transition-all duration-300" />
					</div>
					<CarouselContent>
						{accounts.map((account) => (
							<CarouselItem key={account.id} className="pl-2 md:pl-4 basis-full md:basis-3/5 lg:basis-2/5">
								<Card
									className={clsx(
										"p-4 bg-white backdrop-blur-sm cursor-pointer hover:shadow-md transition-all duration-300",
										selectedAccountId === account.id && "ring-2 ring-teal9"
									)}
									style={{ borderBottom: `4px solid ${account.color}` }}
									onClick={() => handleAccountClick(account.id)}
								>
									<div className="flex flex-col">
										<Image
											src={getAccountIcon(account.type)}
											alt={`${account.type} icon`}
											width={40}
											height={40}
											className="bg-gray-100 rounded-full p-2"
										/>
										{account.institution && (
											<p className="text-gray-600 my-2 mb-5">{account.institution}</p>
										)}
										<p className="text-lg font-semibold">
											<span className={clsx("transition-all", { "blur-sm": isHidden })}>
												{new Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: account.currency
												}).format(account.balance)}
											</span>
										</p>
										<p className="text-xs text-gray-600">{t(language, 'Current balance')}</p>
									</div>
								</Card>
							</CarouselItem>
						))}
						<CarouselItem className="pl-2 md:pl-4 basis-full md:basis-3/5 lg:basis-2/5">
							<Card
								className="p-4 bg-white/10 backdrop-blur-sm border-dashed border-2 border-white/30 h-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
								onClick={handleCreateAccount}
							>
								<div className="flex flex-col items-center text-white">
									<PlusCircle size={40} />
									<p className="mt-2">{t(language, 'Add Account')}</p>
								</div>
							</Card>
						</CarouselItem>
					</CarouselContent>
				</Carousel>
			) : (
				<Card
					className="p-4 bg-white/10 backdrop-blur-sm border-dashed border-2 border-white/30 h-32 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
					onClick={handleCreateAccount}
				>
					<div className="flex flex-col items-center text-white">
						<PlusCircle size={40} />
						<p className="mt-2">{t(language, 'Add Your First Account')}</p>
					</div>
				</Card>
			)}
		</section>
	)
}