FROM keymetrics/pm2:latest-alpine as builder

COPY package.json ./

COPY .npmrc ./

RUN npm i https://github.com/sass/node-sass/releases/download/v4.13.0/linux_musl-x64-79_binding.node --save && npm i && mkdir /app /.pm2 && cp -R ./node_modules ./app && chmod 777 /.pm2

ARG env_var

WORKDIR /app

COPY . .

RUN $(npm bin)/ng lint

RUN $(npm bin)/ng build --prod --configuration=$env_var && cp -R ./dist/* .

#COPY --from=builder /app/dist .

EXPOSE 8000

CMD [ "pm2-runtime", "start", "application.config.js" ]
