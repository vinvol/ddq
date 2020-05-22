const request = require("request");

const getStuff = (url) =>
    new Promise((res) =>
        request(url, { json: true }, (err, response, body) => {
            res(body);
        })
    );

module.exports = { getStuff };
