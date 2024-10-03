import { useState, useEffect, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

interface ActionButtonProps {
	user: string;
	setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

interface Transaction {
	_id: string;
	userId: string;
	amount: number;
	category: string;
	date: string;
	description?: string;
}

export default function ActionButton({ user, setTransactions }: ActionButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
	const [amount, setAmount] = useState<number | null>(null);
	const [description, setDescription] = useState<string>('');
	const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
	const [feedback, setFeedback] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	const openModal = (type: 'income' | 'expense') => {
		setModalType(type);
		setModalOpen(true);
		setIsOpen(false);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalType(null);
		setAmount(null);
		setDescription('');
		setDate(new Date().toISOString().split('T')[0]);
	};

	const handleSave = async () => {
		if (amount === null || description === '') {
			setFeedback('Please provide amount and description');
			setTimeout(() => setFeedback(null), 2000);
			return;
		}

		const transactionData = {
			userId: user,
			amount: modalType === 'income' ? amount : -amount,
			category: modalType === 'income' ? 'Income' : 'Expense',
			date,
			description,
		};

		try {
			const token = localStorage.getItem('token');
			const response = await fetch('https://clearcashback.onrender.com/api/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(transactionData),
			});

			if (response.ok) {
				const newTransaction: Transaction = await response.json();
				setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
				setFeedback('Transaction added successfully');
				setTimeout(() => setFeedback(null), 2000);
				closeModal();
				window.location.reload();
			} else {
				setFeedback('Failed to add transaction');
				setTimeout(() => setFeedback(null), 2000);
			}
		} catch (error) {
			console.error('Error adding transaction:', error);
			setFeedback('Error adding transaction');
			setTimeout(() => setFeedback(null), 2000);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative z-20">
			<button
				onClick={toggleMenu}
				className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
			>
				<PlusIcon className="w-6 h-6" />
			</button>

			{isOpen && (
				<div
					ref={menuRef}
					className="fixed bottom-24 right-8 bg-white border dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:text-white"
				>
					<ul className="list-none p-2">
						<li>
							<button
								className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
								onClick={() => openModal('income')}
							>
								<img src="/income.svg" alt="add income" /> Add Income
							</button>
						</li>
						<li>
							<button
								className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
								onClick={() => openModal('expense')}
							>
								<img src="/expense.svg" alt="add expense" /> Add Expense
							</button>
						</li>
					</ul>
				</div>
			)}

			{modalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80">
						<h2 className="text-xl mb-4 dark:text-white">
							{modalType === 'income' ? 'Add Income' : 'Add Expense'}
						</h2>
						<input
							type="number"
							placeholder="Enter amount"
							value={amount || ''}
							onChange={(e) => setAmount(Number(e.target.value))}
							className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
						<input
							type="text"
							placeholder="Enter description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
						<div className="flex justify-end gap-4">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{feedback && (
				<div
					className={`z-50 fixed top-7 left-1/2 w-72 p-4 mb-4 text-sm border border-gray-300 rounded-lg dark:border-gray-700 ${feedback.includes('successfully')
						? 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-900'
						: 'text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-900'
						}`}
					role="alert"
				>
					<span className="font-medium text-center">
						{feedback.includes('successfully') ? 'Success' : 'Error'}
					</span>{' '}
					{feedback}
				</div>
			)}
		</div>
	);
}
