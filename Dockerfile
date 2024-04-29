FROM node:22-alpine3.19
RUN mkdir -p /home/node/neue/node_modules && chown -R node:node /home/node/neue/
WORKDIR /home/node/neue
COPY src/package.json .
USER node
RUN npm install
COPY --chown=node:node src/ .
CMD [ "node", "main.js" ]