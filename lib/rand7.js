'use strict';

const rand5 = require('./rand5');

const rand7 = function () {
    return (
        rand5() +
        rand5() +
        rand5() +
        rand5() +
        rand5() +
        rand5() +
        rand5()
    ) % 7;
};

module.exports = rand7;
