const https = require('https')

// Name of environment variables
const CAPTCHA_SECRET = 'CAPTCHA_SECRET'
// optional
const SECRET_MESSAGE = 'SECRET_MESSAGE'

// Promisified https.request
// https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times
function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        var req = https.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}

/**
 * Supports GET requests with client request token as 'rt' in query string
 * i.e. https://www. .... .com?rt=aaa123456789
 */
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405 
        }
    }
    if (!(CAPTCHA_SECRET in process.env)) {
        console.error('CAPTCHA_SECRET environment variable is not set.\nSet it in site settings > build and deploy > environment.')
        return {
            statusCode: 500
        }
    }
    if (!('rt' in event.queryStringParameters)) {
        console.error('Client response token not found in URL query string.')
        return {
            statusCode: 400
        }
    }
    const params = {
        host: 'google.com',
        path: `/recaptcha/api/siteverify?secret=${process.env[CAPTCHA_SECRET]}&response=${event.queryStringParameters.rt}`,
        method: 'POST'
    }
    return httpRequest(params).then((body) => {
        return body
    }).then((json) => {
        if ('success' in json && json.success === true) {
            return {
                statusCode: 200,
                body: process.env[SECRET_MESSAGE] || ''
            }
        }
        console.log('Captcha verification returned false.')
        return {
            statusCode: 400
        }
    }).catch((err) => {
        console.error(err)
        return {
            statusCode: 500
        }
    })
}
