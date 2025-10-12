FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 4000
CMD ["node", "src/index.js"]

