import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import QRCode from 'qrcode';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Add CORS middleware before other middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
);

app.use(express.json());

// Auth0 JWT validation middleware
const checkJwt = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
});

// Public homepage showing total number of tickets
app.get('/', async (req: Request, res: Response) => {
	const ticketCount = await prisma.ticket.count();
	res.send(`Total tickets generated: ${ticketCount}`);
});

// Protected endpoint for generating tickets
app.post(
	'/api/tickets',
	// checkJwt,
	async (req: Request, res: Response): Promise<void> => {
		console.log('Received request to create ticket');

		const { oib, firstName, lastName } = req.body;

		// Validate input
		if (!oib || !firstName || !lastName) {
			res.status(400).json({ error: 'Missing required fields' });
			return;
		}

		try {
			// Check if oib already has 3 tickets
			const existingTickets = await prisma.ticket.count({
				where: { oib }
			});

			if (existingTickets >= 3) {
				res
					.status(400)
					.json({ error: 'Maximum number of tickets reached for this oib' });
				return;
			}

			// Create new ticket
			const ticket = await prisma.ticket.create({
				data: {
					oib,
					firstName,
					lastName
				}
			});

			// Generate QR code with ticket details URL
			const ticketUrl = `${process.env.BASE_URL}/tickets/${ticket.id}`;
			const qrCode = await QRCode.toDataURL(ticketUrl);

			res.json({
				ticketId: ticket.id,
				qrCode
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
);

// Protected endpoint for viewing ticket details
app.get(
	'/tickets/:id',
	// checkJwt,
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const authHeader = req.headers.authorization;

		try {
			// Replace axios with fetch
			const userInfoResponse = await fetch(
				`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
				{
					headers: {
						Authorization: authHeader || ''
					}
				}
			);

			if (!userInfoResponse.ok) {
				throw new Error('Failed to fetch user info');
			}

			const userInfo = await userInfoResponse.json();

			const ticket = await prisma.ticket.findUnique({
				where: { id }
			});

			if (!ticket) {
				res.status(404).json({ error: 'Ticket not found' });
				return;
			}

			res.json({
				ticket,
				user: {
					name: userInfo.name,
					email: userInfo.email
				}
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
);

app.get('/api/tickets', async (req: Request, res: Response) => {
	console.log('Received request to fetch tickets');
	try {
		const tickets = await prisma.ticket.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
		res.json(tickets);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
