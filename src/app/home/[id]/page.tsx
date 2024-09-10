// src/app/home/[id]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface User {
	_id: string;
	name: string;
	email: string;
	img?: string;
}

const UserPage = () => {
	const { id } = useParams(); // Use useParams para obter os parâmetros da URL
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
		<main>
			<h1>Welcome, {user.name}</h1>
			<p>Email: {user.email}</p>
			{user.img && <img src={user.img} alt={user.name} />}
		</main>
	);
};

export default UserPage;