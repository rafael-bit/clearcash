import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

function getS3Client() {
	const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
	const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
	const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
	const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

	// Validate environment variables - this will only be called at runtime
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
		throw new Error('Missing R2 environment variables');
	}

	// Validar formato das credenciais
	if (R2_ACCESS_KEY_ID.length !== 32) {
		throw new Error(
			'R2_ACCESS_KEY_ID deve ter 32 caracteres. Você está usando um API Token (40 caracteres) em vez de Access Key. ' +
			'Gere Access Keys em: Cloudflare Dashboard > R2 > Manage R2 API Tokens > Create API Token'
		);
	}

	return {
		client: new S3Client({
			region: 'auto',
			endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: R2_ACCESS_KEY_ID,
				secretAccessKey: R2_SECRET_ACCESS_KEY,
			},
		}),
		bucketName: R2_BUCKET_NAME,
	};
}

const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp',
	'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: { type: string; size: number }): { valid: boolean; error?: string } {
	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed.',
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		};
	}

	return { valid: true };
}

export async function uploadFile(
	file: Buffer,
	fileName: string,
	mimeType: string
): Promise<{ fileKey: string; publicUrl: string }> {
	const validation = validateFile({ type: mimeType, size: file.length });
	if (!validation.valid) {
		throw new Error(validation.error);
	}

	let s3Client, bucketName;
	try {
		const clientData = getS3Client();
		s3Client = clientData.client;
		bucketName = clientData.bucketName;
	} catch (error) {
		// Re-throw with a more descriptive error
		if (error instanceof Error && error.message.includes('Missing R2')) {
			throw new Error('R2 configuration is missing. Please configure R2 environment variables in your deployment settings.');
		}
		throw error;
	}
	const fileExtension = fileName.split('.').pop() || '';
	const fileKey = `documents/${randomUUID()}.${fileExtension}`;

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: fileKey,
		Body: file,
		ContentType: mimeType,
	});

	try {
		await s3Client.send(command);
	} catch (error: any) {
		if (error.name === 'NoSuchBucket' || error.message?.includes('does not exist')) {
			throw new Error(
				`Bucket "${bucketName}" não existe ou o nome está incorreto. ` +
				`Verifique se o bucket existe no Cloudflare R2 e se o nome está correto no arquivo .env`
			);
		}
		if (error.name === 'InvalidAccessKeyId' || error.message?.includes('Invalid')) {
			throw new Error(
				`Credenciais inválidas. Verifique se R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY estão corretos. ` +
				`Certifique-se de usar Access Keys (não API Tokens) com 32 caracteres para o Access Key ID.`
			);
		}
		if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
			throw new Error(
				`Acesso negado ao bucket. Verifique se as credenciais têm permissão para escrever no bucket "${bucketName}".`
			);
		}
		throw new Error(`Erro ao fazer upload: ${error.message || error.name || 'Erro desconhecido'}`);
	}

	// Usar endpoint proxy do backend em vez de URL pública direta do R2
	// Isso evita problemas de CORS e acesso público
	const publicUrl = `/api/documents/${fileKey}`;

	return {
		fileKey,
		publicUrl,
	};
}
