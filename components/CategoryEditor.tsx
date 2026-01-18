"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useLanguage } from './LanguageProvider';
import { t } from '@/lib/translations';

interface CustomCategory {
	id: string;
	name: string;
	nameEn?: string;
	icon: string;
	type: 'INCOME' | 'EXPENSE';
}

const availableIcons = [
	'/icons/food.svg',
	'/icons/house.svg',
	'/icons/education.svg',
	'/icons/leisure.svg',
	'/icons/market.svg',
	'/icons/clothing.svg',
	'/icons/health.svg',
	'/icons/transport.svg',
	'/icons/travel.svg',
	'/icons/incomeColor.svg',
	'/icons/expensesColor.svg',
	'/icons/investiments.svg',
	'/icons/wallet.svg',
	'/icons/account.svg',
	'/icons/cardGray.svg',
	'/icons/transactions.svg',
];

interface CategoryEditorProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CategoryEditor({ isOpen, onClose }: CategoryEditorProps) {
	const { language } = useLanguage();
	const [categories, setCategories] = useState<CustomCategory[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		nameEn: '',
		icon: '/icons/expensesColor.svg',
		type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
	});

	useEffect(() => {
		if (isOpen) {
			fetchCategories();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const fetchCategories = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/categories');
			if (!response.ok) throw new Error('Failed to fetch categories');
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error('Error fetching categories:', error);
			toast.error(language === 'pt' ? 'Falha ao carregar categorias' : 'Failed to load categories');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () => {
		try {
			if (!formData.name.trim()) {
				toast.error(language === 'pt' ? 'O nome da categoria é obrigatório' : 'Category name is required');
				return;
			}

			if (editingCategory) {
				const response = await fetch(`/api/categories/${editingCategory.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});

				if (!response.ok) throw new Error('Failed to update category');
				toast.success(t(language, 'Category updated successfully'));
			} else {
				const response = await fetch('/api/categories', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});

				if (!response.ok) throw new Error('Failed to create category');
				toast.success(language === 'pt' ? 'Categoria criada com sucesso' : 'Category created successfully');
			}

			resetForm();
			fetchCategories();
		} catch (error) {
			console.error('Error saving category:', error);
			toast.error(t(language, 'Failed to save category'));
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm(language === 'pt' ? 'Tem certeza que deseja excluir esta categoria?' : 'Are you sure you want to delete this category?')) {
			return;
		}

		try {
			const response = await fetch(`/api/categories/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete category');
			toast.success(t(language, 'Category deleted successfully'));
			fetchCategories();
		} catch (error) {
			console.error('Error deleting category:', error);
			toast.error(language === 'pt' ? 'Falha ao excluir categoria' : 'Failed to delete category');
		}
	};

	const handleEdit = (category: CustomCategory) => {
		setEditingCategory(category);
		setFormData({
			name: category.name,
			nameEn: category.nameEn || category.name,
			icon: category.icon,
			type: category.type,
		});
	};

	const resetForm = () => {
		setEditingCategory(null);
		setFormData({
			name: '',
			nameEn: '',
			icon: '/icons/expensesColor.svg',
			type: 'EXPENSE',
		});
	};

	const incomeCategories = categories.filter(c => c.type === 'INCOME');
	const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{language === 'pt' ? 'Editar Categorias' : 'Edit Categories'}
					</DialogTitle>
					<DialogDescription>
						{language === 'pt'
							? 'Personalize suas categorias de receitas e despesas'
							: 'Customize your income and expense categories'}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Formulário de criação/edição */}
					<div className="border rounded-lg p-4 space-y-4">
						<h3 className="font-semibold">
							{editingCategory
								? language === 'pt' ? 'Editar Categoria' : 'Edit Category'
								: language === 'pt' ? 'Nova Categoria' : 'New Category'}
						</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>{language === 'pt' ? 'Nome (PT)' : 'Name (PT)'}</Label>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder={language === 'pt' ? 'Nome da categoria' : 'Category name'}
								/>
							</div>

							<div className="space-y-2">
								<Label>{language === 'pt' ? 'Nome (EN)' : 'Name (EN)'}</Label>
								<Input
									value={formData.nameEn}
									onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
									placeholder={language === 'pt' ? 'Nome em inglês' : 'English name'}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>{t(language, 'Type')}</Label>
							<RadioGroup
								value={formData.type}
								onValueChange={(value) => setFormData({ ...formData, type: value as 'INCOME' | 'EXPENSE' })}
								className="flex gap-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="INCOME" id="type-income" />
									<Label htmlFor="type-income">{t(language, 'Income')}</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="EXPENSE" id="type-expense" />
									<Label htmlFor="type-expense">{t(language, 'Expenses')}</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label>{language === 'pt' ? 'Ícone' : 'Icon'}</Label>
							<div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
								{availableIcons.map((icon) => (
									<button
										key={icon}
										type="button"
										onClick={() => setFormData({ ...formData, icon })}
										className={`p-2 border rounded hover:bg-gray-100 transition-colors ${
											formData.icon === icon ? 'border-primary bg-primary/10' : ''
										}`}
									>
										<Image src={icon} alt="icon" width={24} height={24} />
									</button>
								))}
							</div>
						</div>

						<div className="flex gap-2">
							<Button onClick={handleSave}>
								{editingCategory
									? language === 'pt' ? 'Salvar' : 'Save'
									: language === 'pt' ? 'Criar' : 'Create'}
							</Button>
							{editingCategory && (
								<Button variant="outline" onClick={resetForm}>
									{language === 'pt' ? 'Cancelar' : 'Cancel'}
								</Button>
							)}
						</div>
					</div>

					{/* Lista de categorias */}
					<div className="space-y-4">
						{/* Receitas */}
						<div>
							<h3 className="font-semibold mb-2 text-green-600">
								{t(language, 'Income')}
							</h3>
							{isLoading ? (
								<div className="text-sm text-gray-500">Loading...</div>
							) : incomeCategories.length > 0 ? (
								<div className="grid grid-cols-2 gap-2">
									{incomeCategories.map((category) => (
										<div
											key={category.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center gap-3">
												<Image
													src={category.icon}
													alt={category.name}
													width={32}
													height={32}
												/>
												<span>{language === 'pt' ? category.name : category.nameEn || category.name}</span>
											</div>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEdit(category)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(category.id)}
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500">
									{language === 'pt' ? 'Nenhuma categoria de receita' : 'No income categories'}
								</p>
							)}
						</div>

						{/* Despesas */}
						<div>
							<h3 className="font-semibold mb-2 text-red-600">
								{t(language, 'Expenses')}
							</h3>
							{isLoading ? (
								<div className="text-sm text-gray-500">Loading...</div>
							) : expenseCategories.length > 0 ? (
								<div className="grid grid-cols-2 gap-2">
									{expenseCategories.map((category) => (
										<div
											key={category.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center gap-3">
												<Image
													src={category.icon}
													alt={category.name}
													width={32}
													height={32}
												/>
												<span>{language === 'pt' ? category.name : category.nameEn || category.name}</span>
											</div>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEdit(category)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(category.id)}
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500">
									{language === 'pt' ? 'Nenhuma categoria de despesa' : 'No expense categories'}
								</p>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
