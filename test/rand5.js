'use strict';

const chiSqr = require('chi-squared-test'),
    rand5    = require('../lib/rand5');

describe('rand5', () => {
    it('should return an integer between 0 and 4 (inclusive)', () => {
        [ 0, 1, 2, 3, 4 ].should.containEql(rand5());
    });

    it('should produce Chi Squared probability above 0.05', () => {
        const expected = [ 1000, 1000, 1000, 1000, 1000 ];

        let observed = [ 0, 0, 0, 0, 0 ];
        for (let i = 0; i < 5000; i++) {
            observed[rand5()]++;
        }

        chiSqr(observed, expected, 1).probability
            .should.be.above(0.05);
    });
});
