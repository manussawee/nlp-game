FROM node

EXPOSE 5000

COPY . /app
WORKDIR /app

RUN cd /app && npm install && npm install -g serve && npm run build

CMD ["serve", "-s", "build"]
