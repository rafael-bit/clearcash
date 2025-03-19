import UserInfo from "@/app/dashboard/_components/user-info";
import { auth } from "@/services/auth";
import Image from "next/image";

export default async function Header() {
	const session = await auth()

	return (
		<header className="flex container mx-auto items-center justify-between p-4">
			<Image src="/logoGreen.svg" alt="logo" width={120} height={120} />
			<UserInfo user={session?.user} />
		</header>
	)
}