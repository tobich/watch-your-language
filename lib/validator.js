function isString(value) {
    return typeof value === 'string' ||
        (typeof value === 'object' && Object.prototype.toString.call(value) === '[object String]');
}

module.exports = function validator(logger) {
    return function __validate__(value) {
        if(isString(value)) {
            const match = value.match(/(^|\W)(f\w{3})(\W|$)/);
            if(match) {
                logger(`Watch your language! You have used forbidden 4-letter f-word "${match[2]}".`);
            }
        }
        return value;
    }
};