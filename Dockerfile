# Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/c32694d67e49950093e38f9fa5248d5c18097e12/Dockerfile
FROM node:16-alpine
RUN mkdir /products-service
WORKDIR /products-service
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
COPY package.json yarn.lock /products-service/
RUN yarn --frozen-lockfile
COPY tsconfig.json /products-service/
CMD /wait && yarn dev
