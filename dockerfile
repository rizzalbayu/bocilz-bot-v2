FROM node:18.16.0-bullseye

WORKDIR /app
COPY package*json ./

RUN npm install -g typescript
RUN npm install 
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]