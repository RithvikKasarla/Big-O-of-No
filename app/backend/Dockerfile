FROM node


WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Start the app
CMD ["npm", "start"]