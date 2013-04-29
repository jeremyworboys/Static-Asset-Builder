
# Static Asset Builder

Easy to use compiler for static assets like CSS, JavaScript and images.


## Installation

Copy `src/Makefile` into your project root.

Alternatively you can run the following command from your project root to download the file.

```
$ curl -O https://raw.github.com/jeremyworboys/Static-Asset-Builder/master/src/Makefile
```


## Usage

- Download the `Makefile`. See *Installation*
- Configure for your project. See *Variables*

There are two build modes:
- `$ make`: Will compile your CSS and JavaScript and lightly optimise images.
- `$ make PRODUCTION=1`: Will compile and compress your CSS and JavaScript as well as heavily optimise images. Use this when you are getting ready to deploy as it can take a while to run.

If you have [`watch(1)`](https://github.com/visionmedia/watch) installed, you can run `watch -q make` to compile your assets as you work.


## Variables

- `target-name`:   The name given to the built CSS and JavaScript files. (Default `app`)
- `src-dir`:       The directory containing the source files. (Default `lib`)
- `build-dir`:     The directory to build the assets into. (Default `build`)
- `scripts-dir`:   The directory within the `src-dir` that contains scripts. (Default `scripts`)
- `scripts-order`: The order that the compiled scripts will be concatenated (space separated). (Default `main.js`)
- `styles-dir`:    The directory within the `src-dir` that contains stylesheets. (Default `styles`)
- `styles-order`:  The order that the compiled stylesheets will be concatenated (space separated). (Default `main.css`)
- `fonts-dir`:     The directory within the `src-dir` that contains fonts. (Default `fonts`)
- `images-dir`:    The directory within the `src-dir` that contains images. (Default `images`)


## Features

- Quick and easy setup
- CSS pre-processing (currently supports LESS and Stylus)
- CSS concatenation and minification
- JavaScript pre-processing (currently supports CoffeeScript)
- JavaScript concatenation and minification with source-maps for debugging
- Image optimisation and compression (currently supports `.png` and `.jpg`)
- Only builds files that have changed since the last run (fast).


## Running Tests

Make sure dependencies are installed:

```
$ npm install
```

Then run:

```
$ make test
```

## License

The MIT License (MIT)

Copyright (c) 2013 Jeremy Worboys

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
