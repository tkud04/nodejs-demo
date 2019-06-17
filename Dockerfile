FROM node:8.11.3-alpine as node
WORKDIR /
# COPY public ./public
#COPY src/index.js ./src/index.js
COPY package*.json ./
RUN npm install --progress=true --loglevel=silent
# COPY src/client ./src/client/
# RUN mkdir -p ./src/client
# COPY src ./src
# RUN ls -al src/client
# RUN find src
# RUN find src
# RUN ls -al src
RUN npm run build