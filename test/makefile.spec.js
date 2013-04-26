
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
            test('scripts', 'scripts', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('cp lib/scripts/main.js build/.js/main.js');
                done();
            });
        });

        it('should not rebuild up-to-date rules', function(done) {
            test('scripts', 'scripts', function(err) {
                if (err) return done(err);
                test(false, 'scripts', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('Nothing to be done');
                    done();
                });
            });
        });
    });

    describe('Styles', function() {});

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
                stdout.should.include('cp lib/fonts/font.eot build/fonts/font.eot');
                stdout.should.include('cp lib/fonts/font.ttf build/fonts/font.ttf');
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
                    stdout.should.include('pngnq -s10 -f -d build/images -e .png lib/images/image-1.png');
                    stdout.should.include('pngnq -s10 -f -d build/images -e .png lib/images/image-2.png');
                    done();
                });
            });

            it('should compress images with pngout', function(done) {
                test('images-png', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('pngout build/images/image-1.png');
                    stdout.should.include('pngout build/images/image-2.png');
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
                    stdout.should.include('jpegoptim  -o -q -d build/images lib/images/image-1.jpg');
                    stdout.should.include('jpegoptim  -o -q -d build/images lib/images/image-2.jpg');
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
                    stdout.should.include('cp lib/images/image-1.gif build/images/image-1.gif');
                    stdout.should.include('cp lib/images/image-2.gif build/images/image-2.gif');
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

        describe('All', function() {
            it('should copy all images to the build directory', function(done) {
                test('images-all', 'images', function(err, stdout) {
                    if (err) return done(err);
                    stdout.should.include('cp lib/images/image-1.gif build/images/image-1.gif');
                    stdout.should.include('cp lib/images/image-2.gif build/images/image-2.gif');
                    stdout.should.include('jpegoptim  -o -q -d build/images lib/images/image-1.jpg');
                    stdout.should.include('jpegoptim  -o -q -d build/images lib/images/image-2.jpg');
                    stdout.should.include('pngnq -s10 -f -d build/images -e .png lib/images/image-1.png');
                    stdout.should.include('pngnq -s10 -f -d build/images -e .png lib/images/image-2.png');
                    done();
                });
            });

            it('should not rebuild up-to-date rules', function(done) {
                test('images-all', 'images', function(err) {
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
