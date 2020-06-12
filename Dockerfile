FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy 'package.json' and 'yarn.lock'
COPY package.json ./
COPY yarn.lock ./

# install project dependencies
RUN yarn install

# copy project files and folders to the current working directory
COPY . .

# build app for production with minification
RUN yarn build

# to make image smaller
RUN rm -rf node_modules

CMD ['tail -f /dev/null']
