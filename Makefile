#
# Static Asset Builder
#
# Version:   0.1
# Author:    Jeremy Worboys <http://jeremyworboys.com>
# Copyright: Copyright (c) 2013 Jeremy Worboys
#

# ------------------------------------------------------------------------------
# VARIABLES
# ------------------------------------------------------------------------------

PRODUCTION         = 0

# Output file-name
target-name        = btg

# Path to the source directory relative to this file
src-dir            = lib

# Path to the output directory relative to this file
build-dir          = static

# Scripts
src-scripts-dir    = $(src-dir)/scripts
src-scripts-order  = pikaday.js main.js

# Styles
src-styles-dir     = $(src-dir)/styles
src-styles-order   = main.styl

# Fonts
src-fonts-dir      = $(src-dir)/fonts
target-fonts-dir   = $(build-dir)/fonts

# Images
src-images-dir     = $(src-dir)/images
target-images-dir  = $(build-dir)/images

# Binary locations
cat                = /bin/cat
uglifyjs           = ./node_modules/uglify-js/bin/uglifyjs
stylus             = ./node_modules/stylus/bin/stylus
nib                = ./node_modules/nib/lib/nib.js
cssmin             = ./node_modules/cssmin/bin/cssmin
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

src-scripts   = $(addprefix $(src-scripts-dir)/,$(src-scripts-order))
target-script = $(build-dir)/$(target-name).js
build-js-tmp  = $(build-dir)/js-tmp
tmp-js-files  = $(addprefix $(build-js-tmp)/,$(addsuffix .js,$(src-scripts-order)))

scripts: $(uglifyjs) $(build-dir) $(target-script)

#
# Concatenate and compress intermediate JS files
#
$(target-script): $(tmp-js-files)
	$(uglifyjs) $+ $(uglify-opts) --output $@ --source-map $@.map --source-map-url /$@.map --source-map-root /
	rm -rf $(build-js-tmp)

#
# Create directory for intermediate JS files
#
$(build-js-tmp):
	mkdir -p $@

#
# Copy source JS files
#
$(build-js-tmp)/%.js.js: $(src-scripts-dir)/%.js $(build-js-tmp)
	$(cat) $< > $@

#
# Compile source Coffeescript files
#
# $(build-js-tmp)/%.styl.js: $(src-scripts-dir)/%.styl $(build-js-tmp) $(stylus)
# 	$(cat) $< | $(fix-imports) | $(stylus) $(stylus-opts) > $@



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

src-fonts    = $(wildcard $(src-fonts-dir)/*)
target-fonts = $(addprefix $(target-fonts-dir)/,$(notdir $(src-fonts)))

fonts: $(target-fonts)

#
# Move source fonts to target directory
#
$(target-fonts): $(src-fonts) $(target-fonts-dir)
	cp $< $@

#
# Create target directory for fonts
#
$(target-fonts-dir):
	mkdir -p $(target-fonts-dir)



# ------------------------------------------------------------------------------
# IMAGES
# ------------------------------------------------------------------------------

png-suffix    = %.png %.bmp %.gif %.pnm %.tiff
jpg-suffix    = %.jpg %.jpeg
src-images    = $(wildcard $(src-images-dir)/*)
target-images = $(addprefix $(target-images-dir)/,$(notdir $(src-images)))

images: $(target-images)

#
# Optimise and compress PNG images
#
$(filter $(png-suffix),$(target-images)): $(filter $(png-suffix),$(src-images)) $(pngout) $(pngnq) $(target-images-dir)
	$(pngnq) $(pngnq-opts) -f -d $(target-images-dir) -e .png $<
	$(pngout) $@ $(pngout-opts) -y -q; exit 0

#
# Optimise and compress JPG images
#
$(filter $(jpg-suffix),$(target-images)): $(filter $(jpg-suffix),$(src-images)) $(jpegoptim) $(target-images-dir)
	$(jpegoptim) $(jpegoptim-opts) -o -q -d $(target-images-dir) $<

#
# Copy remaining source images into target directory
#
$(filter-out $(png-suffix) $(jpg-suffix),$(target-images)): $(filter-out $(png-suffix) $(jpg-suffix),$(src-images)) $(target-images-dir)
	cp $< $@

#
# Create target directory for images
#
$(target-images-dir):
	mkdir -p $(target-images-dir)
