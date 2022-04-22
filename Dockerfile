FROM node:16

# https://docs.docker.jp/engine/reference/builder.html#workdir
WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install

COPY . .
COPY .env.stg .env

# https://docs.docker.jp/engine/reference/builder.html#expose
# EXPOSE 命令はコンテナの実行時に、所定ネットワーク上のどのポートをリッスンするかを指定
EXPOSE 3000

RUN yarn build

CMD [ "yarn", "start" ]
