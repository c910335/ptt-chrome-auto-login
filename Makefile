all: clean build

clean:
	rm -rf dist

build:
	mkdir dist
	zip dist/ptt-auto-login.zip src/* icons/* manifest.json
