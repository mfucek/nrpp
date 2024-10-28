'use client';

import { useState } from 'react';

export default function CreateTicketForm() {
	const [formData, setFormData] = useState({
		oib: '',
		firstName: '',
		lastName: ''
	});
	const [error, setError] = useState('');
	const [qrCode, setQrCode] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData),
					credentials: 'include'
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error);
			}

			const data = await response.json();
			setQrCode(data.qrCode);
			setFormData({ oib: '', firstName: '', lastName: '' });
			setError('');

			// Optionally trigger a refresh of the ticket list
			// window.location.reload();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create ticket');
		}
	};

	return (
		<div className="mt-8">
			<h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="oib" className="block mb-1">
						OIB:
					</label>
					<input
						id="oib"
						type="text"
						value={formData.oib}
						onChange={(e) => setFormData({ ...formData, oib: e.target.value })}
						className="border p-2 w-full rounded"
						required
					/>
				</div>
				<div>
					<label htmlFor="firstName" className="block mb-1">
						First Name:
					</label>
					<input
						id="firstName"
						type="text"
						value={formData.firstName}
						onChange={(e) =>
							setFormData({ ...formData, firstName: e.target.value })
						}
						className="border p-2 w-full rounded"
						required
					/>
				</div>
				<div>
					<label htmlFor="lastName" className="block mb-1">
						Last Name:
					</label>
					<input
						id="lastName"
						type="text"
						value={formData.lastName}
						onChange={(e) =>
							setFormData({ ...formData, lastName: e.target.value })
						}
						className="border p-2 w-full rounded"
						required
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
					Create Ticket
				</button>
			</form>
			{error && <p className="text-red-500 mt-4">{error}</p>}
			{qrCode && (
				<div className="mt-4">
					<h3 className="font-bold mb-2">Generated QR Code:</h3>
					<img src={qrCode} alt="Ticket QR Code" className="border p-2" />
				</div>
			)}
		</div>
	);
}
