'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'pt' | 'en'

interface LanguageContextType {
	language: Language
	setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<Language>('pt')

	useEffect(() => {
		// Carrega o idioma salvo do localStorage
		const savedLanguage = localStorage.getItem('language') as Language
		if (savedLanguage === 'pt' || savedLanguage === 'en') {
			setLanguageState(savedLanguage)
		}
	}, [])

	const setLanguage = (lang: Language) => {
		setLanguageState(lang)
		localStorage.setItem('language', lang)
		// Atualiza o atributo lang do HTML
		document.documentElement.lang = lang
	}

	useEffect(() => {
		// Atualiza o atributo lang do HTML quando o idioma muda
		document.documentElement.lang = language
	}, [language])

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
