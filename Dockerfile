FROM oven/bun

WORKDIR /elysia

COPY package.json .

COPY bun.lockb .

RUN bun install

COPY . .

EXPOSE 3001

CMD [ "bun", "src/index.ts" ]