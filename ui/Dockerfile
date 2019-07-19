FROM node:9.11.1-alpine
MAINTAINER Test Operations

CMD mkdir -p /opt/demo && \
ADD package.json /opt/demo/package.json
COPY build/ /opt/demo/build/
COPY server/ /opt/demo/server/
COPY node_modules/ /opt/demo/node_modules/
COPY .env /opt/demo/.env

WORKDIR /opt/test/
CMD ["node", "server"]
