
MOCHA_OPTS=
REPORTER=dot

# Run unit tests
test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

.PHONY: test
