import { useState, useEffect } from 'react';
import PhotoModal from './PhotoModal';

export default function PhotoSelector({ user, userId }: { user: any; userId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState("/user.png");

	useEffect(() => {
		if (user && user.img) {
			setSelectedPhoto(user.img);
		}
	}, [user]);

	const photos = [
		'https://i.ibb.co/51QvXBw/homem11.png',
		'https://i.ibb.co/tXTRwG3/homem22.png',
		'https://i.ibb.co/ThdYVSR/homem33.png',
		'https://i.ibb.co/PzMzXvh/mulher1.png',
		'https://i.ibb.co/7Nm0b5m/mulher2.png',
		'https://i.ibb.co/Dwx8Jhz/mulher3.png'
	];

	const updatePhoto = async (photoUrl: string) => {
		try {
			const response = await fetch(`https://clearcashback.onrender.com/api/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ img: photoUrl }),
			});

			if (response.ok) {
				setSelectedPhoto(photoUrl);
			} else {
				console.error('Erro ao atualizar a foto.');
			}
		} catch (error) {
			console.error('Erro ao enviar a URL da foto:', error);
		}
	};

	const handlePhotoSelect = (photoUrl: string) => {
		updatePhoto(photoUrl);
		setIsOpen(false);
	};

	return (
		<div>
			<button
				className="group relative w-full h-full"
				onClick={() => setIsOpen(true)}
			>
				<img
					src={selectedPhoto}
					alt="Alterar imagem"
					className="w-full h-full object-cover transition duration-300 group-hover:brightness-50 rounded-full"
				/>

				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
					</svg>
				</div>
			</button>

			<PhotoModal
				photos={photos}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onPhotoSelect={handlePhotoSelect}
			/>
		</div>
	);
}