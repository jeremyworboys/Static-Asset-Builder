
require('chai').should();
var exec = require('child_process').exec;

describe('Makefile', function() {

    describe('Scripts', function() {});

    describe('Styles', function() {});

    describe('Images', function() {});

    describe('Fonts', function() {
        it('should copy all fonts to the build directory', function(done) {
            test('fonts', 'fonts', function(err, stdout) {
                if (err) return done(err);
                stdout.should.include('cp lib/fonts/font.eot build/fonts/font.eot');
                stdout.should.include('cp lib/fonts/font.ttf build/fonts/font.ttf');
                done();
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
    exec([
        'cp -r examples/'+example+' tmp/lib',
        'cd tmp',
        'make '+rule
    ].join(' && '), done);
}
