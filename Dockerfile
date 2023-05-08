FROM node:18-slim
ENV TZ=Central
ENV DOCKER_CONTAINER=1
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

ARG LOG_LEVEL=info
ENV LOG_LEVEL=${LOG_LEVEL}

RUN yarn install --production-only --quiet

COPY . .

RUN yarn prisma generate
RUN yarn build
RUN yarn test

RUN chmod +x start-production.sh

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node
EXPOSE ${APP_PORT}

ENTRYPOINT [ "./start-production.sh" ]
