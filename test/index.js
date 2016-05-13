const expect = require('chai').expect;
const babel = require('babel-core');
const plugin = require('../lib/plugin');
const __validate__ = require('../lib/validator');

function transpile(source) {
    return babel.transform(source, {
        plugins: [plugin]
    }).code;
}

describe('Transpiler', function () {
    it('disallows four-letter-f-words in values', function () {
        const sampleCode = `
        
            var words = ["orward", "un", "lip", "leece"];
            var list = words.map(function (word) {
                return "f" + word;
            });
            
       `;
        const transpiled = transpile(sampleCode);
        expect(() => eval(transpiled)).to.throw('Watch your language! You have used forbidden 4-letter f-word "flip".');
    });

    it('allows polite values in values', function () {
        const sampleCode = `
        
            var words = ["orward", "un", "leece"];
            var list;
            list = words.map(function (word) {
                return "f" + word;
            });
            
       `;
        const transpiled = transpile(sampleCode);
        expect(eval(transpiled)).to.eql([
            'forward', 'fun', 'fleece'
        ]);
    });


});