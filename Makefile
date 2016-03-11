PROJECT = "Mon premier projet en KOA"


test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter spec \
		--require should \
		test.js
        
        
update: ;@echo "Updating ${PROJECT}..." \
        git pull --rebase; \
        npm install

.PHONY: test update
