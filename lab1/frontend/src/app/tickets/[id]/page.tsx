import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

async function getTicketDetails(id: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`);
	if (!res.ok) throw new Error('Failed to fetch ticket');
	return res.json();
}

export default async function TicketPage({
	params
}: {
	params: { id: string };
}) {
	const session = await getSession();
	if (!session?.user) {
		redirect('/api/auth/login');
	}

	const ticketData = await getTicketDetails(params.id);

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
			<div className="border rounded p-4">
				<p>
					<strong>First Name:</strong> {ticketData.ticket.firstName}
				</p>
				<p>
					<strong>Last Name:</strong> {ticketData.ticket.lastName}
				</p>
				<p>
					<strong>OIB:</strong> {ticketData.ticket.oib}
				</p>
				<p>
					<strong>Created At:</strong>{' '}
					{new Date(ticketData.ticket.createdAt).toLocaleString()}
				</p>
				<p className="mt-4">
					<strong>Viewed by:</strong> {ticketData.user.name}
				</p>
			</div>
			<div className="mt-4">
				<a href="/" className="text-blue-500 hover:underline">
					← Back to Home
				</a>
			</div>
		</main>
	);
}
