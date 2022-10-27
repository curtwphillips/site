FROM node:14

WORKDIR /app

COPY package.json /app

RUN npm i

COPY src /app

RUN npm run build

COPY . /app

# CMD [ "nodemon", "--legacy-watch", "server/index" ]
