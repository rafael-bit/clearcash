"use client";

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
import { useEffect, useState } from "react";

export default function Lheader() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header 
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled 
					? "bg-white/80 backdrop-blur-md shadow-lg shadow-gray-200/50" 
					: "bg-transparent"
			}`}
		>
			<div className="flex container py-4 justify-between items-center mx-auto px-4">
				<Link href="/" className="pl-0 sm:pl-0 transition-transform hover:scale-105 duration-300">
					<Image src="/logoBlack.svg" alt="ClearCash Logo" width={125} height={125} />
				</Link>
				<nav className="hidden sm:block">
					<ul className="flex items-center justify-between gap-8">
						<li>
							<Link 
								href="/" 
								className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
							>
								Home
							</Link>
						</li>
						<li>
							<Link 
								href="#features" 
								className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
							>
								Features
							</Link>
						</li>
						<li>
							<Link 
								href="#pricing" 
								className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
							>
								Pricing
							</Link>
						</li>
					</ul>
				</nav>
				<div className="hidden sm:block">
					<Link 
						className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105" 
						href="/auth"
					>
						Get Started
					</Link>
				</div>
				<div className="px-0 block sm:hidden">
					<Sheet>
						<SheetTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
							<Menu className="w-6 h-6" />
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>
									<Image src="/logoBlack.svg" alt="ClearCash Logo" width={125} height={125} />
								</SheetTitle>
							</SheetHeader>
							<nav className="p-4 mt-8">
								<ul className="flex flex-col gap-4">
									<li>
										<Link 
											href="/" 
											className="block w-full p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
										>
											Home
										</Link>
									</li>
									<li>
										<Link 
											href="#features" 
											className="block w-full p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
										>
											Features
										</Link>
									</li>
									<li>
										<Link 
											href="#pricing" 
											className="block w-full p-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
										>
											Pricing
										</Link>
									</li>
								</ul>
							</nav>
							<div className="px-4 mt-6">
								<Link 
									className="block w-full text-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300" 
									href="/auth"
								>
									Get Started
								</Link>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
