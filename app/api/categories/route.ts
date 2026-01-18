import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { prisma } from '@/services/database';

export async function GET(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const categories = await prisma.customCategory.findMany({
			where: {
				userId: session.user.id as string,
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error('Error fetching categories:', error);
		return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { name, nameEn, icon, type } = await request.json();

		if (!name || !icon || !type) {
			return NextResponse.json(
				{ error: 'Name, icon, and type are required' },
				{ status: 400 }
			);
		}

		const category = await prisma.customCategory.create({
			data: {
				name,
				nameEn: nameEn || name,
				icon,
				type,
				userId: session.user.id as string,
			},
		});

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		console.error('Error creating category:', error);
		return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
	}
}
