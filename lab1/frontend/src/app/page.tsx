import CreateTicketForm from '@/components/CreateTicketForm';
import TicketList from '@/components/TicketList';
import { getSession } from '@auth0/nextjs-auth0';

async function getTicketCount() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
	const data = await res.text();
	return data;
}

export default async function Home() {
	const ticketCount = await getTicketCount();
	const session = await getSession();

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-4">Ticket Management System</h1>
			<p>{ticketCount}</p>

			{!session?.user ? (
				<div className="mt-4">
					<a href="/api/auth/login" className="text-blue-500 hover:underline">
						Login
					</a>
				</div>
			) : (
				<div>
					<div className="flex justify-between items-center">
						<p>Welcome, {session.user.name}!</p>
						<a
							href="/api/auth/logout"
							className="text-blue-500 hover:underline">
							Logout
						</a>
					</div>
					<CreateTicketForm />
					<TicketList />
				</div>
			)}
		</main>
	);
}
