default: install

h help:
	@grep '^a-Z' Makefile

s serve:
	yarn start

build:
	yarn build

install:
	bundle install && yarn install

p production:
	yarn production
