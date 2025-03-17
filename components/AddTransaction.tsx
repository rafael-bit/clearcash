"use client"

import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
export default function AddTransaction() {
	const [openModal, setOpenModal] = useState<string | null>(null);
	const [amount, setAmount] = useState<string>("0,00");

	const handleAmountChange = (digit: string) => {
		const cleanValue = amount.replace(/[^0-9]/g, "") + digit;
		const formattedValue = (parseInt(cleanValue, 10) / 100).toFixed(2).replace(".", ",");
		setAmount(formattedValue);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="absolute bottom-5 right-5 bg-teal9 hover:bg-teal-800 transition-all duration-300 rounded-full w-12 h-12 text-white p-3 flex items-center justify-center">
						<Plus />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="top" align="end" className="mr-5 mb-2">
					<DropdownMenuItem onClick={() => setOpenModal("expense")}>
						<Image src="/icons/expensesColor.svg" alt="expense" width={35} height={35} />
						New Expense
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpenModal("income")}>
						<Image src="/icons/incomeColor.svg" alt="income" width={35} height={35} />
						New Income
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpenModal("account")}>
						<Image src="/icons/account.svg" alt="account" width={35} height={35} />
						New Account
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpenModal("subscription")}>
						Subscription
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={openModal === "expense"} onOpenChange={() => setOpenModal(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Expense</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Dialog open={openModal === "income"} onOpenChange={() => setOpenModal(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-center pb-6">New Income</DialogTitle>
					</DialogHeader>
					<Input
						type="text"
						value={amount}
						readOnly
						className="w-full text-5xl text-center bg-transparent outline-none border-none shadow-none pt-5 pb-12"
						onKeyDown={(e) => {
							if (e.key >= "0" && e.key <= "9") {
								handleAmountChange(e.key);
							}
							if (e.key === "Backspace") {
								setAmount((prev) => {
									const cleanValue = prev.replace(/[^0-9]/g, "").slice(0, -1) || "0";
									return (parseInt(cleanValue, 10) / 100).toFixed(2).replace(".", ",");
								});
							}
						}}
					/>
					<div className="flex flex-col border pt-2 pb-1 px-2 rounded-lg">
						<label htmlFor="type" className="text-sm text-gray-500">Income Type</label>
						<Input type="text" placeholder="Ex.: Salary" className="px-0 border-none shadow-none" />
					</div>
					<div className="flex flex-col border pt-2 pb-1 px-2 rounded-lg">
						<label htmlFor="category" className="text-sm text-gray-500">Category</label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Receive at Account" className="text-sm text-gray-500" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="nubank">Nubank</SelectItem>
								<SelectItem value="itau">Itaú</SelectItem>
								<SelectItem value="bradesco">Bradesco</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col border pt-2 pb-1 px-2 rounded-lg">
						<label htmlFor="recieveAt" className="text-sm text-gray-500">Recieve at Account</label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Receive at Account" />
							</SelectTrigger>
						<SelectContent>
							<SelectItem value="nubank">Nubank</SelectItem>
							<SelectItem value="itau">Itaú</SelectItem>
							<SelectItem value="bradesco">Bradesco</SelectItem>
						</SelectContent>
					</Select>
					</div>
					<div className="flex flex-col border pt-2 pb-1 px-2 rounded-lg">
						<label htmlFor="date" className="text-sm text-gray-500">Date</label>
						<Input type="date" placeholder="Ex.: 17/03/2025" className="px-0 border-none shadow-none" />
					</div>
					<Button className="bg-teal9 w-full">Add</Button>
				</DialogContent>
			</Dialog>

			<Dialog open={openModal === "account"} onOpenChange={() => setOpenModal(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Account</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Dialog open={openModal === "subscription"} onOpenChange={() => setOpenModal(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Subscription</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
}
