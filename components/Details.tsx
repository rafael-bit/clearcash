"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, TouchEvent } from "react";
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

const categoryIcons: Record<string, string> = {
	food: "/icons/food.svg",
	home: "/icons/home.svg",
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
	id: number;
	type: "income" | "expense";
	category: keyof typeof categoryIcons;
	amount: number;
	title: string;
	date: Date;
}

interface Tab {
	id: number;
	label: string;
	transactions: Transaction[];
}

const currentMonthIndex = new Date().getMonth();

export default function Details() {
	const { isHidden } = useVisibility();
	const [currentIndex, setCurrentIndex] = useState<number>(currentMonthIndex);
	const [filter, setFilter] = useState<"transactions" | "income" | "expense">("transactions");

	const touchStartX = useRef<number>(0);
	const touchEndX = useRef<number>(0);

	const tabs: Tab[] = [
		{
			id: 0,
			label: "January",
			transactions: [],
		},
		{
			id: 1,
			label: "February",
			transactions: [
				{ id: 3, type: "income", amount: 2000, title: "Salary", date: new Date("2025-02-01"), category: "salary" },
				{ id: 4, type: "expense", amount: 800, title: "Lunch", date: new Date("2025-02-01"), category: "food" },
			],
		},
		{
			id: 2,
			label: "March",
			transactions: [
				{ id: 5, type: "income", amount: 1800, title: "Salary", date: new Date("2025-03-01"), category: "salary" },
				{ id: 6, type: "expense", amount: 600, title: "Lunch", date: new Date("2025-03-01"), category: "food" },
			],
		},
	];

	const handleNext = (): void => {
		if (currentIndex < tabs.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = (): void => {
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
		}
	};

	const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
		touchEndX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (): void => {
		const diff = touchStartX.current - touchEndX.current;
		if (diff > 50) handleNext();
		if (diff < -50) handlePrevious();
	};

	return (
		<section className="rounded-xl bg-gray0 w-full p-7">
			<div className="mb-7">
				<Select defaultValue="transactions" onValueChange={(value) => setFilter(value as "transactions" | "income" | "expense")}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Transactions type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="transactions"><Image src="/icons/transactions.svg" alt="transactions" width={20} height={20} /> Transactions</SelectItem>
						<SelectItem value="income"><Image src="/icons/income.svg" alt="income" width={20} height={20} /> Income</SelectItem>
						<SelectItem value="expense"><Image src="/icons/expenses.svg" alt="expense" width={20} height={20} /> Expenses</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Tabs defaultValue={currentMonthIndex.toString()} className="w-full relative">
				<TabsList className="md:p-3 w-full flex justify-between overflow-hidden">
					<button onClick={handlePrevious} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
						<ChevronLeft className="h-6 w-6" />
					</button>
					<div className="flex gap-5">
						{tabs.map((tab) => (
							<TabsTrigger key={tab.id} value={tab.id.toString()} className="py-1 px-4">
								{tab.label}
							</TabsTrigger>
						))}
					</div>
					<button onClick={handleNext} className="h-10 w-10 text-neutral-900 hover:text-neutral-800">
						<ChevronRight className="h-6 w-6" />
					</button>
				</TabsList>

				{tabs.map((tab) => {
					const filteredTransactions = tab.transactions.filter((transaction) =>
						filter === "transactions" ? true : transaction.type === filter
					);

					return (
						<TabsContent key={tab.id} value={tab.id.toString()}>
							{filteredTransactions.length > 0 ? (
								<table className="w-full border-collapse">
									<tbody>
										{filteredTransactions.map((transaction) => (
											<tr key={transaction.id}>
												<td className="flex justify-between p-2 bg-white hover:bg-gray-100 rounded-lg my-1">
													<div className="flex items-center gap-3">
														<Image src={categoryIcons[transaction.category]} alt={transaction.category} width={40} height={40} />
														<div>
															<p>{transaction.title}</p>
															<p className="text-xs text-neutral-500">{transaction.date.toLocaleDateString()}</p>
														</div>
													</div>
													<p className={clsx(
														"text-sm p-2 transition-all",
														transaction.type === "expense" ? "text-red-500" : "text-green-500",
														{ "blur-sm": isHidden }
													)}>
														{transaction.type === "expense" ? "-" : ""}
														{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
													</p>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="flex flex-col items-center justify-center h-full px-5 my-3">
									<Image src="/empty.svg" alt="empty" width={300} height={300} />
									<p className="text-center text-gray-500 py-4">No transactions found for this month.</p>
								</div>
							)}
						</TabsContent>
					);
				})}
			</Tabs>
		</section>
	);
}