FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

COPY themes ./themes

RUN npm ci

RUN npm run tsc -w themes/sample

RUN npm run tsc -w  extensions/video

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
