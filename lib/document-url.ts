/**
 * Normaliza URLs de documentos para usar o endpoint proxy
 * Converte URLs antigas do R2 para o formato do proxy
 */
export function normalizeDocumentUrl(url: string): string {
	if (!url) return url;

	// Se já é uma URL do proxy, retorna como está
	if (url.startsWith('/api/documents/')) {
		return url;
	}

	// Se é uma URL do R2 (com ou sem protocolo), extrai o fileKey e converte para proxy
	if (url.includes('.r2.cloudflarestorage.com/') || url.includes('.r2.dev/')) {
		try {
			// Adiciona protocolo se não tiver
			const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
			const urlObj = new URL(urlWithProtocol);
			const pathname = urlObj.pathname;
			
			// Remove a barra inicial se houver e remove query params
			let fileKey = pathname.startsWith('/') ? pathname.slice(1) : pathname;
			
			// Remove query parameters se houver (ex: ?X-Amz-Algorithm=...)
			const queryIndex = fileKey.indexOf('?');
			if (queryIndex !== -1) {
				fileKey = fileKey.substring(0, queryIndex);
			}
			
			const normalized = `/api/documents/${fileKey}`;
			console.log('Normalizing URL:', { original: url, normalized });
			return normalized;
		} catch (error) {
			console.error('Error normalizing URL:', url, error);
			// Se falhar ao parsear, tenta extrair manualmente
			const match = url.match(/(?:r2\.cloudflarestorage\.com|r2\.dev)\/(.+?)(?:\?|$)/);
			if (match && match[1]) {
				const normalized = `/api/documents/${match[1]}`;
				console.log('Normalized via regex:', { original: url, normalized });
				return normalized;
			}
			return url;
		}
	}

	// Para outras URLs, retorna como está
	return url;
}
