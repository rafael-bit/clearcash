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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/components/LanguageProvider"
import { Label } from "@/components/ui/label"


type Props = {
	user: Session['user']
}

export default function UserInfo({ user }: Props) {
	const { language, setLanguage } = useLanguage()

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
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="language-select">
							{language === 'pt' ? 'Idioma' : 'Language'}
						</Label>
						<Select value={language} onValueChange={(value) => setLanguage(value as 'pt' | 'en')}>
							<SelectTrigger id="language-select" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pt">Português</SelectItem>
								<SelectItem value="en">English</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button className="bg-green-800 hover:bg-green-700 transition-all duration-300 w-full" onClick={() => signOut()}>
						{language === 'pt' ? 'Sair' : 'Sign Out'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}