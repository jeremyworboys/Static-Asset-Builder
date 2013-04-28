
MOCHA_OPTS=--slow 1000
REPORTER=spec

# Run unit tests
test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

.PHONY: test
