# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}-alpine

# Install xdg-utils for xdg-open
RUN apk update && apk add xdg-utils

WORKDIR /usr/src/app

# Copy package.json so that package manager commands can be used.
COPY package.json yarn.lock ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN yarn install

# RUN mkdir -p /usr/src/app/.vite && chmod -R 777 /usr/src/app/.vite
# RUN mkdir -p /usr/src/app/node_modules/.vite && \chown -R node:node /usr/src/app/node_modules

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3031

# Run the application.
CMD ["yarn", "run", "vite", "--host"]
