import { useFont } from '@/app/components/FontContext';
import { useState } from 'react';
import ThemeSwitcherStyle from './ThemeSwitcherStyle';

export default function StyleSection() {
	const { font, setFont, fontSize, setFontSize } = useFont();
	const [previewFont, setPreviewFont] = useState(font);
	const [previewFontSize, setPreviewFontSize] = useState(fontSize);

	const handleSave = () => {
		setFont(previewFont);
		setFontSize(previewFontSize);
		alert('Font and size changed and saved successfully!');
	};

	return (
		<div className="space-y-2 w-4/5">
			<div className="flex items-center mb-5">
				<div className="sm:mr-5 md:mr-10">
					<h2>Select Source</h2>

					<select
						value={previewFont}
						onChange={(e) => setPreviewFont(e.target.value)}
						className="px-4 py-2 border rounded-md bg-gray-300 dark:bg-gray-800"
					>
						<option value="font-sans">Sans</option>
						<option value="font-serif">Serif</option>
						<option value="font-mono">Mono</option>
					</select>
				</div>
				<div className="sm:mr-5 md:mr-10">
					<h2>Select Font Size</h2>

					<select
						value={previewFontSize}
						onChange={(e) => setPreviewFontSize(e.target.value)}
						className="px-4 py-2 border rounded-md bg-gray-300 dark:bg-gray-800"
					>
						<option value="text-sm">Small</option>
						<option value="text-base">Medium</option>
						<option value="text-lg">Big</option>
						<option value="text-xl">Very Big</option>
					</select>
				</div>
				<div>
					<ThemeSwitcherStyle />
				</div>
			</div>

			<div className={`mt-10 ${previewFont} ${previewFontSize} border p-4 rounded-md`}>
				<p>
					This is a preview of the text using the selected font and size.
				</p>
			</div>

			<div className="text-center">
				<button
					onClick={handleSave}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-center"
				>
					Save Font and Size
				</button>
			</div>
		</div>
	);
}
