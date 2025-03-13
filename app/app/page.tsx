import Header from '@/components/Header'
import BalanceCard from '@/components/BalanceCard'
import Details from '@/components/Details'
import { VisibilityProvider } from '@/components/VisibilityProvider'

export default function Page() {
	return (
		<>
			<Header />
			<VisibilityProvider>
				<main className="flex flex-col md:flex-row gap-4 container mx-auto px-4">
					<BalanceCard />
					<div className="w-full md:w-1/2">
						<Details />
					</div>
				</main>
			</VisibilityProvider>
		</>
	)
}