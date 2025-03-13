'use client'

import { EyeClosed, Eye } from 'lucide-react'
import MyAccounts from '@/components/MyAccounts'
import clsx from "clsx"
import { useVisibility } from './VisibilityProvider'

export default function BalanceCard() {
	const { isHidden, toggleVisibility } = useVisibility();

	return (
		<div className="flex flex-col justify-between w-full md:w-1/2 h-[85vh] py-6 px-4 rounded-xl bg-teal9">
			<div>
				<p className="text-white">Total balance</p>
				<h1 className="mt-2 flex items-center gap-4 text-white text-3xl font-semibold">
					<span className={clsx("transition-all", { "blur-sm": isHidden })}>
						$ 100.00
					</span>
					<button onClick={toggleVisibility} className="cursor-pointer">
						{isHidden ? (
							<Eye className="w-4 h-4 text-white" />
						) : (
							<EyeClosed className="w-4 h-4 text-white" />
						)}
					</button>
				</h1>
			</div>
			<MyAccounts/>
		</div>
	)
}