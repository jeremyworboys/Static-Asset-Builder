
require('chai').should();
var exec = require('child_process').exec;

describe('Makefile', function() {

    describe('Scripts', function() {
        it('should create the temp directory', function(done) {
            test('scripts', 'scripts', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('mkdir -p build/.js');
                done();
            });
        });

        it('should optimise scripts with uglify-js', function(done) {
            test('scripts', 'scripts scripts-order="include.js main.js"', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('uglifyjs');
                done();
            });
        });

        it('should not rebuild up-to-date rules', function(done) {
            test('scripts', 'scripts scripts-order="include.js main.js"', function(err) {
                if (err) return done(err);
                test(false, 'scripts scripts-order="include.js main.js"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('Nothing to be done');
                    done();
                });
            });
        });

        describe('JavaScript', function(done) {
            it('should copy all files to the temp directory', function(done) {
                test('scripts', 'scripts scripts-order="include.js main.js"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/scripts');
                    done();
                });
            });
        });
    });

    describe('Styles', function() {
        it('should create the temp directory', function(done) {
            test('styles', 'styles', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('mkdir -p build/.css');
                done();
            });
        });

        it('should concatenate and minify styles with cssmin', function(done) {
            test('styles', 'styles styles-order="include.css main.css"', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('cat');
                stdout.should.include('cssmin');
                done();
            });
        });

        it('should not rebuild up-to-date rules', function(done) {
            test('styles', 'styles styles-order="include.css main.css"', function(err) {
                if (err) return done(err);
                test(false, 'styles styles-order="include.css main.css"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('Nothing to be done');
                    done();
                });
            });
        });

        describe('CSS', function(done) {
            it('should copy all files to the temp directory', function(done) {
                test('styles', 'styles styles-order="include.css main.css"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/styles');
                    done();
                });
            });
        });

        describe('Less', function(done) {
            it('should fix imports and compile files to the temp directory', function(done) {
                test('styles-less', 'styles styles-order="include.less main.less"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('sed');
                    stdout.should.include('lessc');
                    done();
                });
            });
        });

        describe('Stylus', function(done) {
            it('should fix imports and compile files to the temp directory', function(done) {
                test('styles-stylus', 'styles styles-order="include.styl main.styl"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('sed');
                    stdout.should.include('stylus');
                    done();
                });
            });
        });

        describe('Combination', function(done) {
            it('should fix imports and compile files to the temp directory', function(done) {
                test('styles-combo', 'styles styles-order="include.css main.styl"', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/styles');
                    stdout.should.include('sed');
                    stdout.should.include('stylus');
                    done();
                });
            });
        });
    });

    describe('Fonts', function() {
        it('should create the build directory', function(done) {
            test('fonts', 'fonts', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('mkdir -p build/fonts');
                done();
            });
        });

        it('should copy all fonts to the build directory', function(done) {
            test('fonts', 'fonts', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('cp lib/fonts');
                done();
            });
        });

        it('should not rebuild up-to-date rules', function(done) {
            test('fonts', 'fonts', function(err, stdout) {
                if (err) return done(err);
                test(false, 'fonts', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('Nothing to be done');
                    done();
                });
            });
        });
    });

    describe('Images', function() {
        it('should create the build directory', function(done) {
            test('images-png', 'images', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('mkdir -p build/images');
                done();
            });
        });

        describe('PNG', function() {
            it('should optimise images with pngnq', function(done) {
                test('images-png', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('pngnq');
                    done();
                });
            });

            it('should compress images with pngout', function(done) {
                test('images-png', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('pngout');
                    done();
                });
            });

            it('should not rebuild up-to-date rules', function(done) {
                test('images-png', 'images', function(err) {
                    if (err) return done(err);
                    test(false, 'images', function(err, stdout) {
                        if (err) return done(err);
                        stdout.should.include('Nothing to be done');
                        done();
                    });
                });
            });
        });

        describe('JPG', function() {
            it('should compress images with jpegoptim', function(done) {
                test('images-jpg', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('jpegoptim');
                    done();
                });
            });

            it('should not rebuild up-to-date rules', function(done) {
                test('images-jpg', 'images', function(err) {
                    if (err) return done(err);
                    test(false, 'images', function(err, stdout) {
                        if (err) return done(err);
                        stdout.should.include('Nothing to be done');
                        done();
                    });
                });
            });
        });

        describe('GIF', function() {
            it('should copy all images to the build directory', function(done) {
                test('images-gif', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/images');
                    done();
                });
            });

            it('should not rebuild up-to-date rules', function(done) {
                test('images-gif', 'images', function(err) {
                    if (err) return done(err);
                    test(false, 'images', function(err, stdout) {
                        if (err) return done(err);
                        stdout.should.include('Nothing to be done');
                        done();
                    });
                });
            });
        });

        describe('Combination', function() {
            it('should copy all images to the build directory', function(done) {
                test('images-combo', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/images');
                    stdout.should.include('jpegoptim');
                    stdout.should.include('pngnq');
                    stdout.should.include('pngout');
                    done();
                });
            });

            it('should not rebuild up-to-date rules', function(done) {
                test('images-combo', 'images', function(err) {
                    if (err) return done(err);
                    test(false, 'images', function(err, stdout) {
                        if (err) return done(err);
                        stdout.should.include('Nothing to be done');
                        done();
                    });
                });
            });
        });
    });

    beforeEach(function(done) {
        exec([
            'mkdir tmp',
            'cp src/Makefile tmp/'
        ].join(' && '), done);
    });

    afterEach(function(done) {
        exec('rm -r tmp', done);
    });
});

function test(example, rule, done) {
    var cmd = [
        'cd tmp',
        'make node_modules=../node_modules '+rule
    ];
    if (example) cmd.unshift('cp -r examples/'+example+' tmp/lib');
    exec(cmd.join(' && '), done);
}
