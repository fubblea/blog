.PHONY: dev build preview install

install:
	npm install

dev:
	npm run docs:dev

build:
	npm run docs:build

preview:
	npm run docs:preview