import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { uploadFile } from '@/services/r2';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'File is required' },
				{ status: 400 }
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const { publicUrl } = await uploadFile(
			buffer,
			file.name,
			file.type
		);

		return NextResponse.json({
			url: publicUrl,
			fileName: file.name,
			mimeType: file.type,
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to upload file' },
			{ status: 500 }
		);
	}
}
