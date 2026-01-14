"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { t } from '@/lib/translations';
import { normalizeDocumentUrl } from '@/lib/document-url';

interface Document {
	id: string;
	url: string;
	fileName: string;
	mimeType: string;
	uploadedAt: string;
	transaction?: {
		id: string;
		title: string;
		date: string;
	};
}

interface ImageGalleryProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ImageGallery({ isOpen, onClose }: ImageGalleryProps) {
	const { language } = useLanguage();
	const [images, setImages] = useState<Document[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const fetchImages = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/transactions');
			if (!response.ok) throw new Error('Failed to fetch transactions');

			const transactions = await response.json() as Array<{
				id: string;
				title: string;
				date: string;
				documents?: Document[];
			}>;
			const allImages: Document[] = [];

			transactions.forEach((transaction) => {
				if (transaction.documents && transaction.documents.length > 0) {
					transaction.documents.forEach((doc: Document) => {
						if (doc.mimeType.startsWith('image/')) {
							allImages.push({
								...doc,
								transaction: {
									id: transaction.id,
									title: transaction.title,
									date: transaction.date,
								},
							});
						}
					});
				}
			});

			setImages(allImages);
		} catch (error) {
			console.error('Error fetching images:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchImages();
		}
	}, [isOpen, fetchImages]);

	const openImage = (index: number) => {
		setSelectedIndex(index);
	};

	const closeImage = () => {
		setSelectedIndex(null);
	};

	useEffect(() => {
		if (selectedIndex === null) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) {
				setSelectedIndex(selectedIndex + 1);
			} else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
				setSelectedIndex(selectedIndex - 1);
			} else if (e.key === 'Escape') {
				setSelectedIndex(null);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedIndex, images.length]);

	const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>{t(language, 'Image Gallery')}</DialogTitle>
					</DialogHeader>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
						</div>
					) : images.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 px-5">
							<p className="text-center text-gray-500 py-4">
								{t(language, 'No images found.')}
							</p>
						</div>
					) : (
						<div className="overflow-y-auto flex-1">
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
								{images.map((image, index) => (
									<div
										key={image.id}
										className="relative group cursor-pointer"
										onClick={() => openImage(index)}
									>
										<div className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all">
											<img
												src={normalizeDocumentUrl(image.url)}
												alt={image.fileName}
												className="w-full h-full object-cover"
												onError={(e) => {
													console.error('Error loading image:', image.url);
													(e.target as HTMLImageElement).style.display = 'none';
												}}
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end">
												<div className="w-full p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
													<p className="text-white text-xs truncate">{image.fileName}</p>
													{image.transaction && (
														<p className="text-white/80 text-xs truncate">{image.transaction.title}</p>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{selectedImage && selectedIndex !== null && (
				<div
					className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
					onClick={closeImage}
				>
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-4 right-4 text-white hover:bg-white/20"
						onClick={closeImage}
					>
						<X className="h-6 w-6" />
					</Button>

					{selectedIndex > 0 && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-4 text-white hover:bg-white/20"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedIndex(selectedIndex - 1);
							}}
						>
							<ChevronLeft className="h-8 w-8" />
						</Button>
					)}

					{selectedIndex < images.length - 1 && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 text-white hover:bg-white/20"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedIndex(selectedIndex + 1);
							}}
						>
							<ChevronRight className="h-8 w-8" />
						</Button>
					)}

					<div
						className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={normalizeDocumentUrl(selectedImage.url)}
							alt={selectedImage.fileName}
							className="max-w-full max-h-[90vh] object-contain"
							onError={(e) => {
								console.error('Error loading image:', selectedImage.url);
								(e.target as HTMLImageElement).style.display = 'none';
							}}
						/>
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
							<p className="text-white font-medium">{selectedImage.fileName}</p>
							{selectedImage.transaction && (
								<>
									<p className="text-white/80 text-sm mt-1">{selectedImage.transaction.title}</p>
									<p className="text-white/60 text-xs mt-1">
										{new Date(selectedImage.transaction.date).toLocaleDateString()}
									</p>
								</>
							)}
							<p className="text-white/60 text-xs mt-2">
								{selectedIndex + 1} / {images.length}
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
