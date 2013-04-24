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
nib                = $(CURDIR)/node_modules/nib/lib/nib.js
uglifyjs           = $(CURDIR)/node_modules/uglify-js/bin/uglifyjs
stylus             = $(CURDIR)/node_modules/stylus/bin/stylus
pngout             = /usr/local/bin/pngout
pngnq              = /usr/local/bin/pngnq
jpegoptim          = /usr/local/bin/jpegoptim

# Build binary options
ifeq ($(PRODUCTION),1)
uglify-opts        = --mangle --compress
stylus-opts        = --use $(nib) --import nib --compress
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

# Default build
all: scripts styles fonts images

# Clean-up previous builds
clean:
	rm -rf $(build-dir)

# Install binaries
install: $(uglifyjs) $(stylus) $(nib) $(optipng) $(jpegtran)

$(uglifyjs):
	npm install uglify-js

$(stylus):
	npm install stylus

$(nib):
	npm install nib

$(pngout):
	$(error You need to install pngout manually. Get the binary from http://www.jonof.id.au/kenutils)

$(pngnq):
	brew install pngnq

$(jpegoptim):
	brew install jpegoptim

# Create bulid directory
$(build-dir):
	mkdir -p $@



# ------------------------------------------------------------------------------
# SCRIPTS
# ------------------------------------------------------------------------------

src-scripts   = $(addprefix $(src-scripts-dir)/,$(src-scripts-order))
target-script = $(build-dir)/$(target-name).js

# Convenience alias
scripts: $(target-script)

# Actual build step
$(target-script):  $(wildcard $(src-scripts-dir)/*) $(uglifyjs) $(build-dir)
	$(uglifyjs) $< $(uglify-opts) --output $@ --source-map $@.map --source-map-url /$@.map --source-map-root /



# ------------------------------------------------------------------------------
# STYLES
# ------------------------------------------------------------------------------

src-styles    = $(addprefix $(src-styles-dir)/,$(src-styles-order))
target-styles = $(build-dir)/$(target-name).css

# Convenience alias
styles: $(target-styles)

# Actual build step
$(target-styles): $(wildcard $(src-styles-dir)/*) $(stylus) $(nib) $(build-dir)
	cd $(src-styles-dir); \
	$(stylus) $(stylus-opts) < $(notdir $(src-styles)) > $(CURDIR)/$(target-styles)



# ------------------------------------------------------------------------------
# FONTS
# ------------------------------------------------------------------------------

src-fonts    = $(wildcard $(src-fonts-dir)/*)
target-fonts = $(addprefix $(target-fonts-dir)/,$(notdir $(src-fonts)))

# Convenience alias
fonts: $(target-fonts)

# Actual build step
$(target-fonts-dir):
	mkdir -p $(target-fonts-dir)

$(target-fonts): $(src-fonts) $(target-fonts-dir)
	cp $< $@



# ------------------------------------------------------------------------------
# IMAGES
# ------------------------------------------------------------------------------

png-suffix    = %.png %.bmp %.gif %.pnm %.tiff
jpg-suffix    = %.jpg %.jpeg
src-images    = $(wildcard $(src-images-dir)/*)
target-images = $(addprefix $(target-images-dir)/,$(notdir $(src-images)))

# Convenience alias
images: $(target-images)

# Actual build step
$(target-images-dir):
	mkdir -p $(target-images-dir)

$(filter $(png-suffix),$(target-images)): $(filter $(png-suffix),$(src-images)) $(pngout) $(pngnq) $(target-images-dir)
	$(pngnq) $(pngnq-opts) -f -d $(target-images-dir) -e .png $<
	$(pngout) $@ $(pngout-opts) -y -q; exit 0

$(filter $(jpg-suffix),$(target-images)): $(filter $(jpg-suffix),$(src-images)) $(jpegoptim) $(target-images-dir)
	$(jpegoptim) $(jpegoptim-opts) -o -q -d $(target-images-dir) $<

$(filter-out $(png-suffix) $(jpg-suffix),$(target-images)): $(filter-out $(png-suffix) $(jpg-suffix),$(src-images)) $(target-images-dir)
	cp $< $@


.PHONY: all clean install uninstall scripts styles fonts images
