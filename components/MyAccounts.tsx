'use client'

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

type AccountType = 'bank' | 'investment' | 'wallet'

type Account = {
	id: number
	type: AccountType
	institution: string
	balance: number
	currency: string
	color: string
}

export default function MyAccounts() {
	const { isHidden } = useVisibility();

	const accounts: Account[] = [
		{
			id: 1,
			type: 'bank',
			institution: "Nubank",
			balance: 5000.00,
			currency: "USD",
			color: "#8300fd"
		},
		{
			id: 2,
			type: 'wallet',
			institution: "Carteira",
			balance: 12000.00,
			currency: "USD",
			color: "#05ff22"
		},
		{
			id: 3,
			type: 'investment',
			institution: "Xp investimentos",
			balance: 8500.00,
			currency: "USD",
			color: "#000000"
		},
		{
			id: 4,
			type: 'bank',
			institution: "Inter",
			balance: 3000.00,
			currency: "USD",
			color: "#dece19"
		},
	]

	const getAccountIcon = (type: AccountType) => {
		switch (type) {
			case 'bank':
				return "/icons/cardGray.svg"
			case 'investment':
				return "/icons/investiments.svg"
			default:
				return "/icons/wallet.svg"
		}
	}

	return (
		<section className="w-full">
			<div className="flex justify-between items-center text-white w-full mb-4">
				<p className="text-lg font-semibold">My accounts</p>
			</div>
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
							<Card className="p-4 bg-white backdrop-blur-sm" style={{ borderBottom: `4px solid ${account.color}` }}>
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
									<p className="text-xs text-gray-600">Current balance</p>
								</div>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	)
}