import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

async function getTicketDetails(id: string, accessToken: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch ticket');
	}

	return res.json();
}

export default async function TicketPage({
	params
}: {
	params: { id: string };
}) {
	const session = await getSession();

	if (!session) {
		redirect('/api/auth/login');
	}

	const ticketData = await getTicketDetails(params.id, session.accessToken);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
			<div className="mb-4">
				<p>Welcome, {session.user.name}</p>
			</div>
			<div className="space-y-2">
				<p>OIB: {ticketData.ticket.oib}</p>
				<p>
					Name: {ticketData.ticket.firstName} {ticketData.ticket.lastName}
				</p>
				<p>Created: {new Date(ticketData.ticket.createdAt).toLocaleString()}</p>
			</div>
			<div className="mt-4">
				<a href="/api/auth/logout" className="text-blue-500 hover:underline">
					Logout
				</a>
			</div>
		</div>
	);
}
