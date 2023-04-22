# Use a node.js runtime as the base image
FROM node:latest

# Create a working directory for the app
WORKDIR /app

# Copy the source code for both the backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies for both the backend and frontend
RUN cd backend && npm install && npx prisma generate
RUN cd frontend && npm install && npm run build


# Expose the ports that the backend and frontend will use
EXPOSE 3001
EXPOSE 3000

# Start both services using `npm run start`
CMD ["sh", "-c", "cd backend && npm run start & cd frontend && npm run start"]
