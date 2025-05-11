FROM node:18.20.8-alpine3.20

WORKDIR /app
COPY package*json ./

RUN npm install -g typescript
RUN npm install 
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
