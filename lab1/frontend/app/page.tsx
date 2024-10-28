async function getTicketCount() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
	const data = await res.text();
	return data;
}

export default async function Home() {
	const ticketCount = await getTicketCount();

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-4">Ticket Management System</h1>
			<p>{ticketCount}</p>
			<div className="mt-4">
				<a href="/api/auth/login" className="text-blue-500 hover:underline">
					Login
				</a>
			</div>
		</main>
	);
}
