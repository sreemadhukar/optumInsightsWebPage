FROM keymetrics/pm2:latest-alpine as builder

COPY package*.json ./

RUN npm i && mkdir /app /.pm2 && cp -R ./node_modules ./app && chmod 777 /.pm2

WORKDIR /app

COPY . .

RUN $(npm bin)/ng lint

RUN $(npm bin)/ng build --prod && cp -R ./dist/* .

#COPY --from=builder /app/dist .

EXPOSE 8000

CMD [ "pm2-runtime", "start", "application.config.js" ]
