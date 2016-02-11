'use strict';

const chiSqr = require('chi-squared-test'),
    rand7    = require('../lib/rand7');

describe('rand7', () => {
    it('should return an integer between 0 and 4 (inclusive)', () => {
        [ 0, 1, 2, 3, 4, 5, 6 ].should.containEql(rand7());
    });

    it('should produce Chi Squared probability above 0.05', () => {
        const expected = [ 1000, 1000, 1000, 1000, 1000, 1000, 1000 ];

        const observed = [ 0, 0, 0, 0, 0, 0, 0 ];
        for (let i = 0; i < 7000; i++) {
            observed[rand7()]++;
        }

        chiSqr(observed, expected, 1).probability
            .should.be.above(0.05);
    });
});
