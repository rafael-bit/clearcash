'use client'

import { EyeClosed, Eye } from 'lucide-react'
import MyAccounts from '@/components/MyAccounts'
import clsx from "clsx"
import { useVisibility } from './VisibilityProvider'
import { useState, useEffect } from 'react'

type BankAccount = {
	id: string
	name: string
	institution: string
	balance: number
	type: 'BANK' | 'INVESTMENT' | 'WALLET'
	currency: string
	color: string
}

export default function BalanceCard() {
	const { isHidden, toggleVisibility } = useVisibility()
	const [totalBalance, setTotalBalance] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/bank-accounts')
				if (!response.ok) throw new Error('Failed to fetch accounts')

				const accounts: BankAccount[] = await response.json()
				const total = accounts.reduce((sum, account) => sum + account.balance, 0)
				setTotalBalance(total)
			} catch (error) {
				console.error('Error fetching accounts:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchAccounts()
	}, [])

	return (
		<div className="flex flex-col justify-between w-full md:w-1/2 h-[85vh] py-6 px-4 rounded-xl bg-teal9">
			<div>
				<p className="text-white">Total balance</p>
				<h1 className="mt-2 flex items-center gap-4 text-white text-3xl font-semibold">
					{isLoading ? (
						<div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
					) : (
						<span className={clsx("transition-all", { "blur-sm": isHidden })}>
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD'
							}).format(totalBalance)}
						</span>
					)}
					<button onClick={toggleVisibility} className="cursor-pointer">
						{isHidden ? (
							<Eye className="w-4 h-4 text-white" />
						) : (
							<EyeClosed className="w-4 h-4 text-white" />
						)}
					</button>
				</h1>
			</div>
			<MyAccounts />
		</div>
	)
}