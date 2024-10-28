Run using bun

create docker db: cd backend && sh start-database.sh

frontend: cd frontend && bun start
backend: cd backend && bunx prisma generate && bun dev
