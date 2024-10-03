"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const FontContext = createContext({
	font: 'font-sans',
	fontSize: 'text-base',
	setFont: (font: string) => { },
	setFontSize: (size: string) => { },
});

export function FontProvider({ children }: { children: React.ReactNode }) {
	// Inicializar como `null` e definir depois de pegar o valor
	const [font, setFont] = useState<string | null>(null);
	const [fontSize, setFontSize] = useState<string | null>(null);

	// useEffect para carregar dados do localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedFont = localStorage.getItem('selectedFont') || 'font-sans';
			const storedFontSize = localStorage.getItem('fontSize') || 'text-base';
			setFont(storedFont);
			setFontSize(storedFontSize);
		}
	}, []);

	// Atualiza localStorage quando `font` mudar
	useEffect(() => {
		if (font !== null) {
			localStorage.setItem('selectedFont', font);
		}
	}, [font]);

	// Atualiza localStorage quando `fontSize` mudar
	useEffect(() => {
		if (fontSize !== null) {
			localStorage.setItem('fontSize', fontSize);
		}
	}, [fontSize]);

	if (font === null || fontSize === null) {
		// Retorna null ou um loader enquanto o estado não foi inicializado
		return null;
	}

	return (
		<FontContext.Provider value={{ font, setFont, fontSize, setFontSize }}>
			{children}
		</FontContext.Provider>
	);
}

export function useFont() {
	return useContext(FontContext);
}
