.PHONY: build start

install:
	npm install
	cd frontend && npm install

build:
	make -C frontend build

start:
	npx start-server -s ./frontend/dist

