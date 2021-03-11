.PHONY: all install run

all: install run

install:
	npm install

run:
	ionic serve
