"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Help() {
	const router = useRouter();

	return (
		<main className="w-full bg-white dark:bg-gray-800 flex p-6">
			<button
				onClick={() => router.back()}
				className="mb-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 w-24 h-10"
			>
				Voltar
			</button>
			<div className="p-6 max-w-4xl mx-auto bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-lg">

				<h1 className="text-2xl pb-10">Help Center</h1>
				<p>Welcome to the ClearCash Help Center! Here, you will find detailed information about how to use our financial control app. If you have any questions, feel free to reach out to our support team at suporte@clearcash.com.</p>

				<h2 className="text-lg p-4 font-bold">Getting Started</h2>
				<p>To get started with ClearCash, follow these steps:</p>
				<ol className="list-decimal pl-6">
					<li>
						<b>Sign Up:</b> Create an account by providing your name, email, and a secure password. Make sure to confirm your password.
					</li>
					<li>
						<b>Log In:</b> After signing up, log in to your account using your registered email and password.
					</li>
					<li>
						<b>Explore the Dashboard:</b> Once logged in, you will see your dashboard, where you can view your financial information, transactions, and insights.
					</li>
				</ol>

				<h2 className="text-lg p-4 font-bold">Managing Transactions</h2>
				<p>ClearCash allows you to easily manage your financial transactions:</p>
				<ol className="list-decimal pl-6">
					<li>
						<b>Add Transactions:</b> Click on the &quot;Add Transaction&quot; button to input your income or expenses. Fill in the necessary details, such as amount, category, and date.
					</li>
					<li>
						<b>Edit Transactions:</b> You can edit any existing transaction by selecting it from your transaction list and making the necessary changes.
					</li>
					<li>
						<b>Delete Transactions:</b> To remove a transaction, select it and click the &quot;Delete&quot; button.
					</li>
				</ol>

				<h2 className="text-lg p-4 font-bold">Using Categories</h2>
				<p>Organize your transactions using categories:</p>
				<ul className="list-disc pl-6">
					<li>Choose from predefined categories or create your own for better tracking.</li>
					<li>Use categories to generate insights and reports on your spending habits.</li>
				</ul>

				<h2 className="text-lg p-4 font-bold">Privacy and Security</h2>
				<p>Your privacy and security are our top priorities:</p>
				<ul className="list-disc pl-6">
					<li>We collect minimal personal information necessary for providing our services.</li>
					<li>Your data is secured with industry-standard encryption.</li>
					<li>Review our <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</Link></li>
				</ul>

				<h2 className="text-lg p-4 font-bold">FAQs</h2>
				<p>Here are some frequently asked questions:</p>
				<ul className="list-disc pl-6">
					<li>
						<b>What if I forget my password?</b> You can reset your password by clicking on the &quot;Forgot Password?&quot; link on the login page.
					</li>
					<li>
						<b>How can I contact support?</b> You can reach out to our support team at suporte@clearcash.com for any inquiries.
					</li>
					<li>
						<b>Is my data safe?</b> Yes, we implement robust security measures to protect your data.
					</li>
				</ul>

				<h2 className="text-lg p-4 font-bold">Contact Us</h2>
				<p>If you have any further questions or need assistance, please contact us at suporte@clearcash.com. We’re here to help!</p>
			</div>
		</main>
	);
}