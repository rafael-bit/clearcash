import Header from '@/components/Header'
import BalanceCard from '@/components/BalanceCard'

export default function Page() {
	return (
		<>
			<Header />
			<main className="flex gap-4 container mx-auto px-4">
				<BalanceCard />
				<div className="w-1/2">
					<h1>Welcome to the app</h1>
				</div>
			</main>
		</>
	)
}