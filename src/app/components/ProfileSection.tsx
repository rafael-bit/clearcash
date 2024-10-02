"use client";
import { useState } from "react";

interface ProfileSectionProps {
	userData: { name: string; email: string };
	userId: string;
	onUpdateUser: (name: string, email: string) => Promise<void>;
	onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ProfileSection({ userData, onUpdateUser, onUpdatePassword }: ProfileSectionProps) {
	const [name, setName] = useState(userData.name);
	const [email, setEmail] = useState(userData.email);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isNameEditable, setIsNameEditable] = useState(false);
	const [isEmailEditable, setIsEmailEditable] = useState(false);
	const [isPasswordEditable, setIsPasswordEditable] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

	const handleSaveChanges = async () => {
		try {
			await onUpdateUser(name, email);
			if (isPasswordEditable) {
				if (!currentPassword || !newPassword || !confirmPassword) {
					setFeedbackMessage("Preencha a senha atual, a nova senha e a confirmação.");
					setFeedbackType("error");
					return;
				}
				if (newPassword !== confirmPassword) {
					setFeedbackMessage("As novas senhas não coincidem.");
					setFeedbackType("error");
					return;
				}
				await onUpdatePassword(currentPassword, newPassword);
			}

			setFeedbackMessage("Alterações salvas com sucesso!");
			setFeedbackType("success");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setIsPasswordEditable(false);

			setTimeout(() => setFeedbackMessage(""), 3000);
		} catch (error) {
			setFeedbackMessage("Erro ao salvar as alterações. Verifique os dados e tente novamente.");
			setFeedbackType("error");
		}
	};

	return (
		<div className="w-4/5">
			{feedbackMessage && (
				<div className={`mt-4 p-2 rounded ${feedbackType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
					{feedbackMessage}
				</div>
			)}
			<div className="text-xl font-semibold dark:text-white text-gray-900">
				<div>
					<span className="font-medium text-base">Name:</span>
					<div className="relative">
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							readOnly={!isNameEditable}
							className={`border border-gray-700 rounded p-2 pr-10 w-full mt-1 mb-5 font-light text-base ${isNameEditable ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-800 "}`}
						/>
						<button className="absolute right-2 top-3" onClick={() => setIsNameEditable(!isNameEditable)}>
							<svg
								className="w-6 h-6 text-gray-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m-3 3l10-10a2.121 2.121 0 00-3-3l-10 10"></path>
							</svg>
						</button>
					</div>
				</div>
				<div>
					<span className="font-medium text-base">Email:</span>
					<div className="relative">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							readOnly={!isEmailEditable}
							className={`border border-gray-700 rounded p-2 pr-10 w-full mt-1 mb-5 font-light text-base ${isEmailEditable ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-800"}`}
						/>
						<button className="absolute right-2 top-3" onClick={() => setIsEmailEditable(!isEmailEditable)}>
							<svg
								className="w-6 h-6 text-gray-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m-3 3l10-10a2.121 2.121 0 00-3-3l-10 10"></path>
							</svg>
						</button>
					</div>
				</div>
				<div>
					<span className="font-medium text-base">Change your password:</span>
					<div className="relative">
						<input
							type="password"
							placeholder="Senha atual"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							readOnly={!isPasswordEditable}
							className={`border border-gray-700 rounded p-2 pr-10 w-full mt-1 font-light text-base placeholder:text-gray-900 dark:placeholder:text-gray-100 ${isPasswordEditable ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-800"}`}
						/>
						<button className="absolute right-2 top-3" onClick={() => setIsPasswordEditable(!isPasswordEditable)}>
							<svg
								className="w-6 h-6 text-gray-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m-3 3l10-10a2.121 2.121 0 00-3-3l-10 10"></path>
							</svg>
						</button>
					</div>
					<div className="relative mt-2">
						<input
							type="password"
							placeholder="Nova senha"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							readOnly={!isPasswordEditable}
							className={`border border-gray-700 rounded p-2 pr-10 w-full mt-1 font-light text-base placeholder:text-gray-900 dark:placeholder:text-gray-100 ${isPasswordEditable ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-800"}`}
						/>
					</div>
					<div className="relative mt-2">
						<input
							type="password"
							placeholder="Confirme a nova senha"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							readOnly={!isPasswordEditable}
							className={`border border-gray-700 rounded p-2 pr-10 w-full mt-1 mb-5 font-light text-base placeholder:text-gray-900 dark:placeholder:text-gray-100 ${isPasswordEditable ? "bg-gray-200 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-800"}`}
						/>
					</div>
				</div>
			</div>
			<div className="text-center">
				<button onClick={handleSaveChanges} className="text-center mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					Salvar Alterações
				</button>
			</div>
		</div>
	);
}