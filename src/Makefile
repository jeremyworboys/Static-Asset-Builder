#
# Static Asset Builder
#
# Version:   0.0.1
# Author:    Jeremy Worboys <http://jeremyworboys.com>
# Copyright: Copyright (c) 2013 Jeremy Worboys
#

# ------------------------------------------------------------------------------
# VARIABLES
# ------------------------------------------------------------------------------

PRODUCTION         = 0

# Output file-name
target-name        = make

# Path to the source directory relative to this file
src-dir            = lib

# Path to the output directory relative to this file
build-dir          = build

# Scripts
scripts-dir        = scripts
scripts-order      = main.js

# Styles
src-styles-dir     = $(src-dir)/styles
src-styles-order   = main.styl

# Fonts
fonts-dir          = fonts

# Images
images-dir         = images

# Binary locations
node_modules       = ./node_modules
cat                = /bin/cat
uglifyjs           = $(node_modules)/.bin/uglifyjs
stylus             = $(node_modules)/.bin/stylus
nib                = $(node_modules)/nib/lib/nib.js
cssmin             = $(node_modules)/.bin/cssmin
pngout             = /usr/local/bin/pngout
pngnq              = /usr/local/bin/pngnq
jpegoptim          = /usr/local/bin/jpegoptim

# Build binary options
ifeq ($(PRODUCTION),1)
uglify-opts        = --mangle --compress
stylus-opts        = --use $(nib) --import nib
pngout-opts        = -s0 -n1 -f0
pngnq-opts         = -s1
jpegoptim-opts     = --strip-all
else
uglify-opts        =
stylus-opts        = --use $(nib) --import nib
pngout-opts        = -s3 -n1
pngnq-opts         = -s10
jpegoptim-opts     =
endif



# ------------------------------------------------------------------------------
# GENERIC
# ------------------------------------------------------------------------------
.PHONY: all clean scripts styles fonts images

#
# Compile all assets
#
all: scripts styles fonts images

#
# Create target build directory
#
$(build-dir):
	mkdir -p $@

#
# Clean-up previous build
#
clean:
	rm -rf $(build-dir)



# ------------------------------------------------------------------------------
# BINARIES
# ------------------------------------------------------------------------------

$(uglifyjs):
	npm install uglify-js

$(stylus):
	npm install stylus

$(nib):
	npm install nib

$(cssmin):
	npm install cssmin

$(pngout):
	$(error You need to install pngout manually. Get the binary from http://www.jonof.id.au/kenutils)

$(pngnq):
	brew install pngnq

$(jpegoptim):
	brew install jpegoptim



# ------------------------------------------------------------------------------
# SCRIPTS
# ------------------------------------------------------------------------------

scripts: $(build-dir)/$(target-name).js $(uglifyjs)

#
# Concatenate and compress intermediate JS files
#
$(build-dir)/$(target-name).js: $(addprefix $(build-dir)/.js/,$(addsuffix .js,$(basename $(scripts-order))))
	$(uglifyjs) $+ $(uglify-opts) --output $@ --source-map $@.map --source-map-url /$@.map --source-map-root /

#
# Copy source JS files
#
$(build-dir)/.js/%.js: $(src-dir)/$(scripts-dir)/%.js $(build-dir)/.js
	cp $< $@

#
# Create directory for intermediate JS files
#
$(build-dir)/.js:
	mkdir -p $@



# ------------------------------------------------------------------------------
# STYLES
# ------------------------------------------------------------------------------

src-styles    = $(addprefix $(src-styles-dir)/,$(src-styles-order))
target-styles = $(build-dir)/$(target-name).css
build-css-tmp = $(build-dir)/css-tmp
tmp-css-files = $(addprefix $(build-css-tmp)/,$(addsuffix .css,$(src-styles-order)))

fix-imports   = sed -E "s/@import (['\"])(.*)(['\"])/@import \1$(subst /,\/,$(src-styles-dir))\/\2\3/g"

styles: $(cssmin) $(build-dir) $(target-styles)

#
# Concatenate and compress intermediate CSS files
#
$(target-styles): $(tmp-css-files)
ifeq ($(PRODUCTION),1)
	$(cat) $+ | $(cssmin) > $@
else
	$(cat) $+ > $@
endif
	rm -rf $(build-css-tmp)

#
# Create directory for intermediate CSS files
#
$(build-css-tmp):
	mkdir -p $@

#
# Copy source CSS files
#
$(build-css-tmp)/%.css.css: $(src-styles-dir)/%.css $(build-css-tmp)
	$(cat) $< > $@

#
# Compile source Stylus files
#
$(build-css-tmp)/%.styl.css: $(src-styles-dir)/%.styl $(build-css-tmp) $(stylus)
	$(cat) $< | $(fix-imports) | $(stylus) $(stylus-opts) > $@



# ------------------------------------------------------------------------------
# FONTS
# ------------------------------------------------------------------------------

fonts: $(subst $(src-dir),$(build-dir),$(wildcard $(src-dir)/$(fonts-dir)/*))

#
# Move source fonts to target directory
#
$(build-dir)/$(fonts-dir)/%: $(src-dir)/$(fonts-dir)/% $(build-dir)/$(fonts-dir)
	cp $< $@

#
# Create target directory for fonts
#
$(build-dir)/$(fonts-dir):
	mkdir -p $(build-dir)/$(fonts-dir)



# ------------------------------------------------------------------------------
# IMAGES
# ------------------------------------------------------------------------------

# TODO: Multi-suffix rules
# png-suffix = %.png %.bmp %.gif %.pnm %.tiff
# jpg-suffix = %.jpg %.jpeg

images: $(subst $(src-dir),$(build-dir),$(wildcard $(src-dir)/$(images-dir)/*))

#
# Optimise and compress PNG images
#
$(build-dir)/$(images-dir)/%.png: $(src-dir)/$(images-dir)/%.png $(pngout) $(pngnq) $(build-dir)/$(images-dir)
	$(pngnq) $(pngnq-opts) -f -d $(build-dir)/$(images-dir) -e .png $<
	$(pngout) $@ $(pngout-opts) -y -q; exit 0

#
# Optimise and compress JPG images
#
$(build-dir)/$(images-dir)/%.jpg: $(src-dir)/$(images-dir)/%.jpg $(jpegoptim) $(build-dir)/$(images-dir)
	$(jpegoptim) $(jpegoptim-opts) -o -q -d $(build-dir)/$(images-dir) $<

#
# Copy remaining source images into target directory
# This rule comes last because rules are top down
#
$(build-dir)/$(images-dir)/%: $(src-dir)/$(images-dir)/% $(build-dir)/$(images-dir)
	cp $< $@

#
# Create target directory for images
#
$(build-dir)/$(images-dir):
	mkdir -p $(build-dir)/$(images-dir)
