import { CheckIcon, CrownIcon, HeartIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function Pricing() {
	return (
		<div id="pricing" className="container mx-auto my-5">
			<h1 className="text-4xl font-bold">Pricing</h1>
			<p className="text-sm text-gray-500 mb-10">You can improve your plan by adding more features to your plan.</p>
			<div className="flex flex-col md:flex-row gap-4 justify-center">
				<div className="bg-gray-100 p-7 rounded-lg lg:max-w-1/2 m-5 lg:m-0">
					<HeartIcon className="w-9 h-9 text-green-700" />
					<div className="px-4 p-1 mt-5 bg-white inline-block rounded-full">
						<h2 className="text-lg font-bold  bg-linear-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">Free Account</h2>
					</div>
					<div className="flex items-baseline space-x-1 mt-7">
						<span className="text-6xl font-bold bg-linear-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">$0</span>
						<span className="text-sm text-gray-500">/mês</span>
					</div>
					<ul className="mt-7">
						<li className="flex items-center gap-3">
							<CheckIcon className="w-4 h-4 text-green-700" />
							Registration and control of income and expenses
						</li>
						<li className="flex items-center gap-3">
							<CheckIcon className="w-4 h-4 text-green-700" />
							Organization by categories for better visualization of your expenses
						</li>
						<li className="flex items-center gap-3">
							<CheckIcon className="w-4 h-4 text-green-700" />
							Alerts and reminders to never miss a due date
						</li>
						<li className="flex items-center gap-3">
							<CheckIcon className="w-4 h-4 text-green-700" />
							Detailed reports to track your financial progress
						</li>
					</ul>
					<Button className="mt-10 text-center w-full bg-white text-green-700 hover:bg-linear-to-r from-green-600 to-teal-600 hover:text-white transition-all duration-300">Get Started</Button>
				</div>
				<div className="bg-teal9 p-7 rounded-lg lg:max-w-1/2 m-5 lg:m-0">
					<CrownIcon className="w-9 h-9 text-gray-100" />
					<div className="px-4 p-1 mt-5 bg-white inline-block rounded-full">
						<h2 className="text-lg font-bold  bg-linear-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">Max Account</h2>
					</div>
					<div className="flex items-baseline space-x-1 mt-7">
						<span className="text-6xl font-bold text-white">$10</span>
						<span className="text-sm text-gray-300">/mês</span>
					</div>
					<ul className="mt-7">
						<li className="flex items-center gap-3 text-green-50">
							<CheckIcon className="w-4 h-4" />
							All features of the Free Plan
						</li>
						<li className="flex items-center gap-3 text-green-50">
							<CheckIcon className="w-4 h-4" />
							Interactive dashboard with dynamic graphs to monitor your finances in a clear and intuitive way
						</li>
						<li className="flex items-center gap-3 text-green-50">
							<CheckIcon className="w-4 h-4" />
							Creation of automatic spreadsheets with all your accounts to facilitate financial planning and analysis
						</li>
						<li className="flex items-center gap-3 text-green-50">
							<CheckIcon className="w-4 h-4" />
							Customized reports to better understand your consumption habits and make smarter decisions
						</li>
					</ul>
					<Button className="mt-10 text-center w-full bg-white text-green-700 hover:bg-linear-to-r from-green-600 to-teal-600 hover:text-white transition-all duration-300">Get Started</Button>
				</div>
			</div>
		</div>
	)
}
