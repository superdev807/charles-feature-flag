FROM node:8.9-alpine
WORKDIR /feature-flag-dashboard
COPY package.json /feature-flag-dashboard/package.json
COPY package-lock.json /feature-flag-dashboard/package-lock.json
RUN npm install webpack-dev-server -g
RUN npm install
COPY . /feature-flag-dashboard
CMD ["npm", "run", "start"]

