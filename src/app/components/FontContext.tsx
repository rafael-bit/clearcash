"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const FontContext = createContext({
	font: 'font-sans',
	fontSize: 'text-base',
	setFont: (font: string) => { },
	setFontSize: (size: string) => { },
});

export function FontProvider({ children }: { children: React.ReactNode }) {
	const [font, setFont] = useState(() => {
		return localStorage.getItem('selectedFont') || 'font-sans';
	});

	const [fontSize, setFontSize] = useState(() => {
		return localStorage.getItem('fontSize') || 'text-base';
	});

	useEffect(() => {
		localStorage.setItem('selectedFont', font);
	}, [font]);

	useEffect(() => {
		localStorage.setItem('fontSize', fontSize);
	}, [fontSize]);

	return (
		<FontContext.Provider value={{ font, setFont, fontSize, setFontSize }}>
			{children}
		</FontContext.Provider>
	);
}

export function useFont() {
	return useContext(FontContext);
}