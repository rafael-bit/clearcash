"use client";
import { useLanguage } from './LanguageContext';

const LanguageSwitcher = () => {
	const { language, changeLanguage } = useLanguage();
	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'es', label: 'Español' },
		{ code: 'fr', label: 'Français' },
		{ code: 'zh', label: '中文' },
		{ code: 'pt', label: 'Português' },
	];

	const saveLanguage = (code: string) => {
		changeLanguage(code);
		alert(`Language changed to: ${code}`);
	};

	return (
		<div id="language" className="flex flex-col items-center">
			<select
				value={language}
				onChange={(e) => saveLanguage(e.target.value)}
				className="mb-4 p-2 border rounded-md"
			>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.label}
					</option>
				))}
			</select>
			<button
				onClick={() => saveLanguage(language)}
				className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
			>
				Save Language
			</button>
		</div>
	);
};

export default LanguageSwitcher;
