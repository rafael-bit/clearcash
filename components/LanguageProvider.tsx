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
		const savedLanguage = localStorage.getItem('language') as Language
		if (savedLanguage === 'pt' || savedLanguage === 'en') {
			setLanguageState(savedLanguage)
		}
	}, [])

	const setLanguage = (lang: Language) => {
		setLanguageState(lang)
		localStorage.setItem('language', lang)
		document.documentElement.lang = lang
	}

	useEffect(() => {
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
