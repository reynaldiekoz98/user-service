# ---- Stage 1: test (build fails if tests fail) ----
FROM node:20-slim AS test
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm test

# ---- Stage 2: runtime (only the app files, no tests, non-root) ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=test --chown=node:node /app/index.js /app/package.json ./
COPY --from=test --chown=node:node /app/src ./src

USER node
EXPOSE 3001
CMD ["node", "index.js"]
