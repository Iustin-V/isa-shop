FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

COPY extensions ./extensions

RUN npm ci

RUN npm run tsc -w  extensions/video
RUN npm run tsc -w  extensions/resend

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
