FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8002
CMD ["npm", "run", "start"]