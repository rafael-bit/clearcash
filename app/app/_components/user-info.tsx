'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"


type Props = {
	user: Session['user']
}

export default function UserInfo({ user }: Props) {
	if (!user) { return <h1>User Not Found</h1> }

	const nameParts = user?.name?.split(' ') || [];
	const initials = nameParts.length > 1
		? nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase()
		: nameParts[0]?.slice(0, 2).toUpperCase();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex items-center justify-center space-y-4 cursor-pointer">
					<Avatar className="w-10 h-10">
						<AvatarFallback className="bg-green-400/20 text-green-800">
							{initials}
						</AvatarFallback>
					</Avatar>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{user?.name}</DialogTitle>
					<DialogDescription>{user?.email}</DialogDescription>
				</DialogHeader>
				<Button className="bg-green-800 hover:bg-green-700 transition-all duration-300" onClick={() => signOut()}>Sign Out</Button>
			</DialogContent>
		</Dialog>
	)
}