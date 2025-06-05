.PHONY: build start

install:
	make -C frontend install

build:
	make -C frontend build

start:
	npx start-server -s ./frontend/dist

