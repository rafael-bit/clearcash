"use client";

import { useRouter } from "next/navigation";

export default function Terms() {
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
				<h1 className="text-2xl pb-10 text-gray-800 dark:text-gray-200">Terms and Conditions</h1>
				<p className="text-gray-800 dark:text-gray-300">
					Welcome to the Terms of Service and Privacy Policy of ClearCash, a financial control app developed by ClearCash. By using the services provided by this app, you agree to the following terms and policies. Please read carefully before using our services.
				</p>

				<h2 className="text-lg p-4 font-bold text-gray-800 dark:text-gray-200"><b>Terms of Service</b></h2>

				<ul className="list-decimal pl-6 text-gray-800 dark:text-gray-300">
					<li>
						<b>Acceptance of Terms: </b>
						By using ClearCash, you agree to these Terms of Service. If you do not agree to these terms, please do not use the application.
					</li>
					<li>
						<b>Use of the App: </b>
						ClearCash is intended exclusively for personal financial control. Commercial use or any activity that violates local, national, or international laws is strictly prohibited.
					</li>
					<li>
						<b>User Responsibilities: </b>
						You are responsible for maintaining the confidentiality of your login information. Any activity conducted through your account is your responsibility.
					</li>
					<li>
						<b>Changes to the Terms: </b>
						We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated through the app or other appropriate means.
					</li>
					<li>
						<b>Account Suspension or Termination: </b>
						We may suspend or terminate your account at our discretion if we believe you have violated these Terms of Service or are engaged in fraudulent activities.
					</li>
				</ul>

				<h2 className="text-lg p-4 font-bold text-gray-800 dark:text-gray-200"><b>Privacy Policy</b></h2>

				<ul className="list-decimal pl-6 text-gray-800 dark:text-gray-300">
					<li>
						<b>Information Collected: </b>
						We collect limited personal information necessary to provide our services, such as account information, financial transactions, and other relevant details.
					</li>
					<li>
						<b>Use of Information: </b>
						The information collected is used solely to provide ClearCash services. We do not share your information with third parties without your consent, except as required by law.
					</li>
					<li>
						<b>Security: </b>
						We implement security measures to protect your information. However, please note that no system is entirely fail-proof.
					</li>
					<li>
						<b>Cookies and Similar Technologies: </b>
						We may use cookies and similar technologies to enhance the user experience and collect information for analysis.
					</li>
					<li>
						<b>Changes to the Privacy Policy:</b>
						We reserve the right to modify this Privacy Policy at any time. Significant changes will be communicated through the app or other appropriate means.
					</li>
				</ul>

				<p className="font-bold mt-4 text-gray-800 dark:text-gray-300">By using ClearCash, you agree to this Privacy Policy and the processing of your information as described herein.</p>
				<p className="font-bold text-gray-800 dark:text-gray-300">If you have any questions or concerns, please contact us at suporte@clearcash.com.</p>

				<p className="mt-4 text-gray-800 dark:text-gray-300">Effective Date: 09/31/2024</p>
				<p className="text-gray-800 dark:text-gray-300">Last Updated: 09/31/2024</p>
			</div>
		</main>
	);
}
