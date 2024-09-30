"use client";
import PhotoSelector from "@/app/components/PhotoSelector";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import ProfileSection from "@/app/components/ProfileSection"; // Novo import
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

const fetchUserData = async (userId: string) => {
	try {
		const response = await fetch(`http://localhost:8080/api/users/${userId}`);
		if (!response.ok) {
			throw new Error("Erro ao buscar usuário");
		}
		const userData = await response.json();
		return userData;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const updateUserData = async (userId: string, data: { name: string; email: string }) => {
	try {
		const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Erro ao atualizar usuário");
		}

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export default function Configuration() {
	const { id: userId } = useParams();
	const [userData, setUserData] = useState<any>(null);
	const [isOpen, setIsOpen] = useState(false);
	const asideRef = useRef<HTMLDivElement>(null);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const getUserData = async () => {
			const data = await fetchUserData(userId as string);
			setUserData(data);
		};
		if (userId) {
			getUserData();
		}
	}, [userId]);

	const handleUpdateUser = async (name: string, email: string) => {
		if (userData) {
			const updatedUser = await updateUserData(userId, { name, email });
			setUserData(updatedUser);
		}
	};

	return (
		<div className="sm:flex antialiased bg-gray-50 dark:bg-gray-900">
			<button
				onClick={toggleSidebar}
				aria-controls="logo-sidebar"
				type="button"
				className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			>
				<span className="sr-only">Open sidebar</span>
				<svg
					className="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						clipRule="evenodd"
						fillRule="evenodd"
						d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
					></path>
				</svg>
			</button>

			<aside
				id="logo-sidebar"
				ref={asideRef}
				className={`fixed top-0 left-0 z-30 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
				aria-label="Sidebar"
			>
				<div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
					<div className="flex items-center mb-5">
						<button
							type="button"
							onClick={() => window.history.back()}
							className="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
							</svg>
							<span className="sr-only">Voltar</span>
						</button>

						<a
							href="#" className="flex items-center ms-2">
							<img
								src="/icon-init.png"
								className="h-6 me-3 sm:h-7"
								alt="Clearcash Logo"
							/>
							<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">ClearCash</span>
						</a>
					</div>

					<ul className="space-y-2 font-medium">
						<li>
							<a
								href={`/home/${userId}`}
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
							>
								<svg
									className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 22 21"
								>
									<path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
									<path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
								</svg>
								<span className="ms-3">Dashboard</span>
							</a>
						</li>
						<li>
							<a
								href="#profile"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
							>
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 18 18"
								>
									<path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
							</a>
						</li>
						<li>
							<a
								href="#"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
							>
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H7V1a1 1 0 1 0-2 0v1H3a1 1 0 1 0 0 2h1v1.045c-.904.107-1.775.303-2.4.57l-.018.007A3.004 3.004 0 0 0 0 6.53V17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6.53a3.003 3.003 0 0 0-2.582-2.907ZM11 15H9a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm3-4H6a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Z" />
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Calendar</span>
								<span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">1</span>
							</a>
						</li>
						<li>
							<a
								href="#language"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
							>
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H7V1a1 1 0 1 0-2 0v1H3a1 1 0 1 0 0 2h1v1.045c-.904.107-1.775.303-2.4.57l-.018.007A3.004 3.004 0 0 0 0 6.53V17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6.53a3.003 3.003 0 0 0-2.582-2.907ZM11 15H9a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm3-4H6a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Z" />
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Language</span>
							</a>
						</li>
					</ul>
				</div>
				<div
					className="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full flex bg-white dark:bg-gray-800 z-20"
				>
					<ThemeSwitcher />
				</div>
			</aside>
			<main className="w-full sm:pl-64 bg-gray-100 dark:bg-gray-900">
				<div id="profile" className="flex flex-col items-center">
					{userData && (
						<>
							<PhotoSelector user={userData} userId={userId as string} />
							<ProfileSection
								userData={userData}
								userId={userId}
								onUpdateUser={handleUpdateUser}
							/>
						</>
					)}
					{!userData && <p className="mt-4 text-gray-900 dark:text-white">Carregando dados do usuário...</p>}
				</div>
				<div id="language">
					<LanguageSwitcher />
				</div>
			</main>
		</div>
	);
}
