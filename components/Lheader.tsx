import Link from "next/link";
import Image from "next/image";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";

export default function Lheader() {
	return (
		<header className="flex container py-5 justify-between items-center mx-auto">
			<Link href="/" className="pl-4 sm:pl-0">
				<Image src="/logoBlack.svg" alt="ClearCash Logo" width={125} height={125} />
			</Link>
			<nav className="hidden sm:block">
				<ul className="flex items-center justify-between gap-3">
					<li>
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="#about">About</Link>
					</li>
					<li>
						<Link href="#features">Features</Link>
					</li>
					<li>
						<Link href="#pricing">Pricing</Link>
					</li>
				</ul>
			</nav>
			<div className="hidden sm:block">
				<Link className="bg-teal9 bg-teal9h text-white px-4 py-1 rounded-full" href="/auth	">Get Started</Link>
			</div>
			<div className="px-4 block sm:hidden">
				<Sheet>
					<SheetTrigger><Menu /></SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle><Image src="/logoBlack.svg" alt="ClearCash Logo" width={125} height={125} /></SheetTitle>
						</SheetHeader>
						<nav className="p-4">
							<ul className="flex flex-col">
								<li className="w-full p-3 bg-white hover:bg-teal-800/50 rounded-full" >
									<Link href="/">Home</Link>
								</li>
								<li className="w-full p-3 bg-white hover:bg-teal-800/50 rounded-full">
									<Link href="#about">About</Link>
								</li>
								<li className="w-full p-3 bg-white hover:bg-teal-800/50 rounded-full">
									<Link href="#features">Features</Link>
								</li>
								<li className="w-full p-3 bg-white hover:bg-teal-800/50 rounded-full">
									<Link href="#pricing">Pricing</Link>
								</li>
							</ul>
						</nav>
						<div className="pl-4">
							<Link className="bg-teal9 bg-teal9h text-white px-4 py-1 rounded-full" href="/auth">Get Started</Link>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
}
