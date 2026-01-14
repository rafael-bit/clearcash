import { NextResponse } from 'next/server';
import { auth } from '@/services/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
	throw new Error('Missing R2 environment variables');
}

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { path } = await params;
		const fileKey = path.join('/');

		console.log('Fetching file from R2:', { fileKey, bucket: R2_BUCKET_NAME });

		const command = new GetObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: fileKey,
		});

		const response = await s3Client.send(command);

		if (!response.Body) {
			console.error('No body in R2 response for:', fileKey);
			return NextResponse.json({ error: 'File not found' }, { status: 404 });
		}

		const body = await response.Body.transformToByteArray();
		const buffer = Buffer.from(body);

		const contentType = response.ContentType || 'application/octet-stream';

		console.log('Successfully fetched file:', { fileKey, contentType, size: buffer.length });

		return new NextResponse(buffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch (error: unknown) {
		const errorObj = error as { message?: string; name?: string; Code?: string };
		const pathValue = (await params).path.join('/');
		
		console.error('Error fetching file from R2:', {
			error: errorObj.message,
			name: errorObj.name,
			code: errorObj.Code,
			path: pathValue,
		});
		
		if (errorObj.name === 'NoSuchKey' || errorObj.Code === 'NoSuchKey') {
			return NextResponse.json({ error: 'File not found' }, { status: 404 });
		}
		
		if (errorObj.name === 'NoSuchBucket' || errorObj.Code === 'NoSuchBucket') {
			return NextResponse.json(
				{ error: `Bucket "${R2_BUCKET_NAME}" not found` },
				{ status: 500 }
			);
		}
		
		return NextResponse.json(
			{ error: `Failed to fetch file: ${errorObj.message || errorObj.name || 'Unknown error'}` },
			{ status: 500 }
		);
	}
}
