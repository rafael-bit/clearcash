import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { prisma } from '@/services/database';

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const { name, nameEn, icon } = await request.json();

		const category = await prisma.customCategory.findUnique({
			where: { id },
		});

		if (!category) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		if (category.userId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const updated = await prisma.customCategory.update({
			where: { id },
			data: {
				name: name || category.name,
				nameEn: nameEn !== undefined ? nameEn : category.nameEn,
				icon: icon || category.icon,
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Error updating category:', error);
		return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;

		const category = await prisma.customCategory.findUnique({
			where: { id },
		});

		if (!category) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		if (category.userId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await prisma.customCategory.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting category:', error);
		return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
	}
}
