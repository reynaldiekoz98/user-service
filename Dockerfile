# ---- Stage 1: test (build fails if tests fail) ----
FROM node:20-slim AS test
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm test

# ---- Stage 2: runtime (only the app files, no tests, non-root) ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
# Fix known CVEs: patch the Debian packages, and drop npm/corepack/yarn (the app has no dependencies and only
# runs `node index.js`, but npm's bundled node_modules carry most of the Trivy findings).
RUN apt-get update \
 && apt-get upgrade -y --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn*
WORKDIR /app
COPY --from=test --chown=node:node /app/index.js /app/package.json ./
COPY --from=test --chown=node:node /app/src ./src

USER node
EXPOSE 3001
CMD ["node", "index.js"]
