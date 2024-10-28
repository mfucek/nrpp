'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Ticket {
	id: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	oib: string;
}

export default function TicketList() {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
					{
						method: 'GET',
						credentials: 'include'
					}
				);

				if (!response.ok) {
					throw new Error('Failed to fetch tickets');
				}

				const data = await response.json();
				setTickets(data);
			} catch (err) {
				setError('Failed to load tickets');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, []);

	if (loading) {
		return <div className="mt-8">Loading tickets...</div>;
	}

	if (error) {
		return <div className="mt-8 text-red-500">{error}</div>;
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-bold mb-4">Your Tickets</h2>
			{tickets.length === 0 ? (
				<p className="text-gray-500">No tickets found.</p>
			) : (
				<div className="space-y-4">
					{tickets.map((ticket) => (
						<Link href={`/tickets/${ticket.id}`} key={ticket.id}>
							<div className="border rounded p-4 hover:bg-gray-50 transition-colors cursor-pointer">
								<div className="font-bold">
									{ticket.firstName} {ticket.lastName}
								</div>
								<div className="text-gray-500 text-sm">
									Created: {new Date(ticket.createdAt).toLocaleDateString()}
								</div>
								<div className="text-gray-500 text-sm">OIB: {ticket.oib}</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
