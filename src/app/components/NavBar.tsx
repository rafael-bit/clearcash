import { useState, useEffect, useRef } from "react";
import Aside from "./Aside";

interface NavBarProps {
	user: {
		_id: string;
		name: string;
		email: string;
		img?: string;
	};
}

export default function NavBar({ user }: NavBarProps) {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMobile = () => {
		setIsMobile(!isMobile);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsMobileOpen(false);
			setIsMenuOpen(false);
		}
	};

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (isMenuOpen || isMobileOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen, isMobileOpen]);

	return (
		<>
			<nav className="z-20 bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 ">
				<div className="flex flex-wrap justify-between items-center">
					<div className="flex justify-start items-center">
						<button
							type="button"
							aria-controls="drawer-navigation"
							className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
							onClick={toggleMobile}
						>
							<svg
								aria-hidden="true"
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
						<a href="#" className="flex items-center justify-between mr-4">
							<img
								src="/icon-init.png"
								className="mr-3 h-8"
								alt="ClearCash Logo"
							/>
							<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ClearCash</span>
						</a>
						<form action="#" method="GET" className="hidden md:block md:pl-2">
							<label htmlFor="topbar-search" className="sr-only">Search</label>
							<div className="relative md:w-64">
								<div
									className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
								>
									<svg
										className="w-5 h-5 text-gray-500 dark:text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										></path>
									</svg>
								</div>
								<input
									type="text"
									name="email"
									id="topbar-search"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="Search"
								/>
							</div>
						</form>
					</div>
					<div className="flex items-center lg:order-2">
						<button
							type="button"
							aria-controls="drawer-navigation"
							className="p-2 mr-1 text-gray-500 rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
							onClick={toggleMobile}
						>
							<span className="sr-only">Toggle search</span>
							<svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path clipRule="evenodd" fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
							</svg>
						</button>
						<button
							type="button"
							data-dropdown-toggle="notification-dropdown"
							className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
						>
							<span className="sr-only">View notifications</span>
							<svg
								aria-hidden="true"
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
								></path>
							</svg>
						</button>
						<div className="flex items-center lg:order-2">
							<button
								type="button"
								className="flex mx-3 text-sm dark:bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
								id="user-menu-button"
								aria-expanded={isMobileOpen}
								onClick={toggleMenu}
							>
								<span className="sr-only">Open user menu</span>
								<img
									className="h-10 rounded-full"
									src={user.img || "/user.png"}
									alt="user photo"
								/>
							</button>

							{isMenuOpen && (
								<div ref={menuRef} className="absolute top-12 right-4 mt-5 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50">
									<div className="flex justify-between items-center py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-t-md">
										<span className="text-sm font-semibold text-gray-900 dark:text-white">Menu</span>
										<button onClick={toggleMenu} className="text-gray-900 dark:text-white">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
											</svg>
										</button>
									</div>
									<div className="py-2 px-4 text-sm text-gray-900 dark:text-white">
										<p>{user.name}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
									</div>
									<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="user-menu-button">
										<li>
											<a href={`/home/${user._id}/config`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Settings</a>
										</li>
										<li>
											<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Out</a>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			{!isMobile && <Aside user={{ _id: user._id }} />}
		</>
	);
}
