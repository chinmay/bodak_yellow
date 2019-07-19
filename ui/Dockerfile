FROM node:9.11.1-alpine
MAINTAINER Test Operations

CMD mkdir -p /opt/xvia-demo && \
ADD package.json /opt/xvia-demo/package.json
COPY build/ /opt/xvia-demo/build/
COPY server/ /opt/xvia-demo/server/
COPY node_modules/ /opt/xvia-demo/node_modules/
COPY .env /opt/xvia-demo/.env

WORKDIR /opt/test/
CMD ["node", "server"]
