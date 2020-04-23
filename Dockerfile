FROM keymetrics/pm2:latest-alpine as builder

COPY package.json ./

COPY .npmrc ./

ENV SASS_BINARY_NAME=linux_musl-x64-72

RUN npm i node-sass@4.13.1 --save && npm i && mkdir /app /.pm2 && cp -R ./node_modules ./app && chmod 777 /.pm2

ARG env_var

WORKDIR /app

COPY . .

RUN $(npm bin)/ng lint

RUN $(npm bin)/ng build --prod --configuration=$env_var && cp -R ./dist/* .

#COPY --from=builder /app/dist .

EXPOSE 8000

CMD [ "pm2-runtime", "start", "application.config.js" ]
