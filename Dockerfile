FROM node:current-alpine
WORKDIR /neue
COPY . .
RUN npm install
CMD ["node", "main.js"]