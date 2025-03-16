import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus } from "lucide-react"
import Image from "next/image"

export default function AddTransaction() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="absolute bottom-5 right-5 bg-teal9 hover:bg-teal-800 transition-all duration-300 rounded-full w-12 h-12 text-white p-3 flex items-center justify-center">
					<Plus />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" align="end" className="mr-5 mb-2">
				<DropdownMenuItem>
					<Image src="/icons/expensesColor.svg" alt="expense" width={35} height={35} />
					New Expense
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Image src="/icons/incomeColor.svg" alt="income" width={35} height={35} />
					New Income
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Image src="/icons/account.svg" alt="account" width={35} height={35} />
					New Account
				</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}