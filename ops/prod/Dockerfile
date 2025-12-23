FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

COPY extensions ./extensions

RUN npm ci

RUN npm run tsc -w  extensions/video
RUN npm run tsc -w  extensions/resend
RUN npm run tsc -w  extensions/subscription

COPY . .

RUN npm run build

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

CMD ["npm", "run", "start"]
