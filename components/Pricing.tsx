"use client";

import { CheckIcon, CrownIcon, HeartIcon, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Pricing() {
	const router = useRouter();

	return (
		<div id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16 fade-in-on-scroll">
					<h2 className="text-4xl md:text-5xl font-bold mb-4">
						Simple, Transparent <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Pricing</span>
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Choose the plan that fits your needs. You can upgrade anytime to unlock more features.
					</p>
				</div>

				<div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
					{/* Free Plan */}
					<div className="group flex-1 bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 fade-in-on-scroll">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
								<HeartIcon className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<div className="px-4 py-1 bg-gray-100 rounded-full inline-block">
									<h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
										Free Account
									</h3>
								</div>
							</div>
						</div>
						
						<div className="flex items-baseline space-x-2 mb-8">
							<span className="text-6xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
								$0
							</span>
							<span className="text-gray-500">/month</span>
						</div>

						<ul className="space-y-4 mb-8">
							{[
								"Registration and control of income and expenses",
								"Organization by categories for better visualization",
								"Alerts and reminders to never miss a due date",
								"Detailed reports to track your financial progress"
							].map((feature, index) => (
								<li key={index} className="flex items-start gap-3">
									<CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
									<span className="text-gray-700">{feature}</span>
								</li>
							))}
						</ul>

						<Button 
							className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-full py-6 text-lg group"
							onClick={() => router.push("/auth")}
						>
							Get Started
							<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Button>
					</div>

					{/* Premium Plan */}
					<div className="group flex-1 relative bg-gradient-to-br from-green-600 to-teal-600 p-8 rounded-3xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 scale-105 md:scale-110 fade-in-on-scroll">
						<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold">
							Most Popular
						</div>
						
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
								<CrownIcon className="w-6 h-6 text-white" />
							</div>
							<div>
								<div className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full inline-block">
									<h3 className="text-lg font-bold text-white">Max Account</h3>
								</div>
							</div>
						</div>

						<div className="flex items-baseline space-x-2 mb-8">
							<span className="text-6xl font-bold text-white">$10</span>
							<span className="text-green-100">/month</span>
						</div>

						<ul className="space-y-4 mb-8">
							{[
								"All features of the Free Plan",
								"Interactive dashboard with dynamic graphs",
								"Automatic spreadsheets for financial planning",
								"Customized reports for smarter decisions"
							].map((feature, index) => (
								<li key={index} className="flex items-start gap-3">
									<CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
									<span className="text-green-50">{feature}</span>
								</li>
							))}
						</ul>

						<Button 
							className="w-full bg-white text-green-700 hover:bg-gray-100 transition-all duration-300 rounded-full py-6 text-lg font-semibold group"
							onClick={() => router.push("/auth")}
						>
							Get Started
							<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
