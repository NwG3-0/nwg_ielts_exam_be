FROM node:16-alpine AS pre-base

RUN apk add --no-cache libc6-compat git

WORKDIR /app

ENV HUSKY=0 CI=true

COPY package.json  yarn.lock ./

RUN npm i -g npm & yarn install --frozen-lockfile

# ----------------------------------------
FROM pre-base AS build

WORKDIR /app

COPY --from=pre-base /app/node_modules ./node_modules
COPY . .

RUN yarn install && yarn build

# ----------------------------------------
FROM build as release

WORKDIR /app

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=build --chown=nodejs:nodejs /app /app

USER nodejs

EXPOSE 2005

CMD ["yarn", "start"]

# ----------------------------------------
FROM pre-base AS builder

EXPOSE 4000

CMD ["tail", "-f", "/dev/null"]
