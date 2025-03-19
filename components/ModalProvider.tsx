'use client'

import { createContext, useContext, useState } from 'react'

interface ModalContextType {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	showAccountForm: boolean
	setShowAccountForm: (show: boolean) => void
	isAccountModalOpen: boolean
	setIsAccountModalOpen: (open: boolean) => void
	openAccountModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [showAccountForm, setShowAccountForm] = useState(false)
	const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

	const openAccountModal = () => {
		setIsAccountModalOpen(true)
		setShowAccountForm(true)
	}

	return (
		<ModalContext.Provider value={{
			isOpen,
			setIsOpen,
			showAccountForm,
			setShowAccountForm,
			isAccountModalOpen,
			setIsAccountModalOpen,
			openAccountModal
		}}>
			{children}
		</ModalContext.Provider>
	)
}

export function useModal() {
	const context = useContext(ModalContext)
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalProvider')
	}
	return context
} 