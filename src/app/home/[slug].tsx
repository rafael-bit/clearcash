// pages/home/[userId].tsx

import { FC, useEffect, useState } from 'react';

interface HomeProps {
	userId: string;
}

const Home: FC<HomeProps> = ({ userId }) => {
	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		const authToken = process.env.TOKEN;

		const fetchUserData = async () => {
			try {
				const response = await fetch(`http://localhost:8080/user/${userId}`, {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch user data');
				}

				setUserData(data.user);
			} catch (error) {
				console.error(error);
			}
		};

		if (authToken) {
			fetchUserData();
		}
	}, [userId]);

	return (
		<div>
			{userData ? (
				<>
					<h1>User Home for ID: {userId}</h1>
					<p>User Name: {userData.name}</p>
					<p>User Email: {userData.email}</p>
				</>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	);
};

export default Home;
