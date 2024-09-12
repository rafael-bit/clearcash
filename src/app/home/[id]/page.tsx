"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/app/components/NavBar';

interface User {
	_id: string;
	name: string;
	email: string;
	img?: string;
}

export default function Home() {
	const { id } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			const fetchUser = async () => {
				try {
					const response = await fetch(`http://localhost:8080/api/users/${id}`);
					if (!response.ok) {
						throw new Error('User not found');
					}
					const data: User = await response.json();
					setUser(data);
				} catch (error) {
					console.error('Error fetching user:', error);
				}
				setLoading(false);
			};

			fetchUser();
		}
	}, [id]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <p>User not found.</p>;
	}

	return (
		<div className="antialiased bg-gray-50 dark:bg-gray-900">
			<NavBar user={user} />

			<main className="p-4 md:ml-64 h-auto pt-20">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div
						className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"
					></div>
					<div
						className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
					></div>
					<div
						className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
					></div>
					<div
						className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
					></div>
				</div>
				<div
					className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"
				></div>
			</main>
		</div>
	);
}