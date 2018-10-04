'use strict';

const io = require('socket.io-client');
const readline = require('readline');
const criton = require('criton');
const algo = 'sha512WithRSAEncryption';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function check(url) {
    if (typeof url !== 'string')
        throw Error('url should be string!');
}

exports.connect = (url, username, password) => {
    check(url);
    
    const regExp = RegExp('^https?://');
    const isHTTP = url.match(regExp);
    
    if (!isHTTP)
        url = 'http://' + url;
    
    const socket = io(`${url}/console`);
    
    socket.emit('auth', username, crypt(password));
    
    socket.on('reject', () => {
        console.log('wrong credentials!');
        process.exit();
    });
    
    socket.on('connect', () => {
        console.log('socket connected');
    
        socket.on('label', (label) => {
            rl.setPrompt(`${label}> `);
            rl.prompt();
        });
        
        socket.on('data', (data) => {
            log(data);
            rl.prompt();
        });
        
        socket.on('disconnect', () => {
            log('socket disconnected');
        });
    });
    
    socket.on('connect_error', ({message}) => {
        console.error(message);
    });
    
    onLine((cmd) => {
        if (!cmd)
            return rl.prompt();
        
        socket.emit('command', {
            cmd
        });
    });
};

function onLine(callback) {
    rl.on('line', (line) => {
        callback(line);
    }).on('close', () => {
        process.exit(0);
    }).on('SIGINT', () => {
        console.log('\n');
        rl.close();
    });
}

function log(a) {
    process.stdout.write(a);
}

function crypt(a) {
    if (!a)
        return a;
    
    return criton(a, algo);
}

