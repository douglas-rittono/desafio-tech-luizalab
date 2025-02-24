IMAGE_NAME = api-desafio-luizalab
PORT = 3000

install:
	npm install

run-local: start-dependencies
	set NODE_ENV=development && npm start

test-local:
	set NODE_ENV=development && npm test

test-coverage:
	set NODE_ENV=development && npm test -- --coverage

start-dependencies:
	docker-compose up -d mongodb

stop-dependencies:
	docker-compose down

build:
	docker build -t $(IMAGE_NAME) .

run: start-dependencies
	docker-compose up -d

clean:
	docker rmi $(IMAGE_NAME)

rebuild:
	clean build run