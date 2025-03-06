'use client'

import Image from "next/image";

export default function Loading() {
	return (
		<main className="fixed inset-0 flex items-center justify-center bg-teal9 z-50 animate-slideUpAndFade">
			<div>
				<Image
					src="/logo.svg"
					alt="loading logo"
					width={125}
					height={125}
					className="drop-shadow-lg text-white"
				/>
			</div>
		</main>
	);
}