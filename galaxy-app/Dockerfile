FROM node:22-bookworm-slim AS dependencies

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
ENV npm_config_build_from_source=true
RUN npm ci --omit=dev

FROM node:22-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends wkhtmltopdf fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY app.js server.js ./
COPY controllers ./controllers
COPY database ./database
COPY internal ./internal
COPY middleware ./middleware
COPY routes ./routes
COPY views ./views
COPY flag.example.txt /flag.txt
RUN mkdir -p /app/store

ENV PORT=8000 \
    DATABASE_PATH=/app/store/galaxy.sqlite

EXPOSE 8000
CMD ["node", "server.js"]
