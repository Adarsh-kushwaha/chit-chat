const moment = require('moment');

const format = (userName, text) => {
    return {
        userName,
        text,
        time: moment().format("h:m a")
    }
}

module.exports = format;