const config = {
    userAgent: 'Foowrap example/1.0.0',
    clientId: 'put your client id here',
    clientSecret: 'put your client secret here',
    refreshToken: 'put your refresh token here'
};


let foo = require('./index.js');
let r = new foo(config); //normal snoowrap config

let x = r.submissionStream({
    sub: ['all'],
    rate: 2000
});

let y = r.commentStream({
    sub: ['all'],
    rate: 2000
});

x.on('post', console.log);
y.on('post',console.log);
/* AddSubFunction
RemoveSubFunction */