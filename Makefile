default: install

h help:
	@grep '^a-Z' Makefile

s serve:
	yarn start

build:
	yarn build

p production:
	yarn production
