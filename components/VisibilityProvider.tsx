'use client'

import { createContext, useState, useContext, ReactNode } from 'react'

interface VisibilityContextType {
	isHidden: boolean;
	toggleVisibility: () => void;
}

const VisibilityContext = createContext<VisibilityContextType>({
	isHidden: false,
	toggleVisibility: () => { },
});

export function VisibilityProvider({ children }: { children: ReactNode }) {
	const [isHidden, setIsHidden] = useState(false);

	const toggleVisibility = () => {
		setIsHidden(prev => !prev);
		console.log("Toggling visibility to:", !isHidden);
	};

	return (
		<VisibilityContext.Provider value={{ isHidden, toggleVisibility }}>
			{children}
		</VisibilityContext.Provider>
	);
}

export const useVisibility = () => useContext(VisibilityContext); 