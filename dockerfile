FROM node:11.13.0-alpine

# Se crea el directorio de destino
RUN mkdir -p /usr/src/kantar
WORKDIR /usr/src/kantar

# actualiza e instala dependencias
RUN apk update && apk upgrade
RUN apk add git

# copiamos la app
COPY . /usr/src/kantar
RUN npm install

# hacemos el build
RUN npm run build

# exponemos el puerto 80
EXPOSE 80

# seteamos el puerto y el host
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=80

# iniciamos la aplicacaion
CMD [ "npm", "start" ]