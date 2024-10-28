import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

async function getTicketDetails(id: string, accessToken: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error('Ticket not found');
		}
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

	if (!session?.user) {
		redirect('/api/auth/login');
	}

	try {
		const ticketData = await getTicketDetails(
			params.id,
			session.accessToken as string
		);

		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
				<div className="mb-4">
					<p>Welcome, {session.user.name}</p>
				</div>
				<div className="bg-white shadow rounded-lg p-6 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="font-semibold">OIB:</p>
							<p>{ticketData.oib}</p>
						</div>
						<div>
							<p className="font-semibold">Name:</p>
							<p>
								{ticketData.firstName} {ticketData.lastName}
							</p>
						</div>
						<div>
							<p className="font-semibold">Created:</p>
							<p>{new Date(ticketData.createdAt).toLocaleString()}</p>
						</div>
						<div>
							<p className="font-semibold">Status:</p>
							<p>{ticketData.status}</p>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<a href="/" className="text-blue-500 hover:underline mr-4">
						Back to Home
					</a>
					<a href="/api/auth/logout" className="text-red-500 hover:underline">
						Logout
					</a>
				</div>
			</div>
		);
	} catch (error) {
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">Error</h1>
				<p className="text-red-500">
					{error instanceof Error ? error.message : 'An error occurred'}
				</p>
				<div className="mt-4">
					<a href="/" className="text-blue-500 hover:underline">
						Back to Home
					</a>
				</div>
			</div>
		);
	}
}
