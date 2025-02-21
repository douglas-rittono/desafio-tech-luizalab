install:
	npm install

run-local:
	set NODE_ENV=development && node src/server.js

test-local:
	set NODE_ENV=development && npm test

test-coverage:
	set NODE_ENV=development && npm test -- --coverage