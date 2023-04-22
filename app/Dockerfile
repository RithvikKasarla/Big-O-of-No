FROM node

# Create Backend Directory
WORKDIR /
# Copy Backend Files
COPY backend backend
# Install Backend Dependencies
RUN npm install --prefix backend

# Create Frontend Directory
WORKDIR /
# Copy Frontend Files
COPY frontend frontend
# Install Frontend Dependencies
RUN npm install --prefix frontend
