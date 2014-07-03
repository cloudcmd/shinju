(function() {
    'use strict';
    
    var io              = require('socket.io-client'),
        readline        = require('readline'),
        
        ERROR_EMPTY     = Error('url could not be empty!'),
        ERROR_TYPE      = Error('url must be string!'),
        
        rl,
            
        CHANNEL     = 'console-data';
    
    exports.connect = function(url) {
        var isString = typeof url === 'string';
        
        if (!url)
            throw(ERROR_EMPTY);
        else if (!isString)
            throw(ERROR_TYPE);
        else
            connect(url);
    };
    
    function connect(url) {
        var socket,
            regExp  = RegExp('^https?://'),
            isHTTP  = url.match(regExp);
        
        if (!isHTTP)
            url = 'http://' + url;
        
        socket = io(url);
        
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        socket.on('connect', function() {
            
            log('socket connected');
            
            socket.on(CHANNEL, function(data) {
                onMessage(data);
                rl.prompt();
            });
            
            socket.on('disconnect', function() {
                log('socket disconnected');
            });
        });
        
        socket.on('connect_error', function(error) {
            logError(error);
        });
        
        rl.setPrompt('> ');
        rl.prompt();
        
        onLine(function(line) {
            socket.emit(CHANNEL, line);
        });
    }
    
    function onLine(callback) {
        rl.on('line', function(line) {
            callback(line);
        }).on('close', function() {
            process.exit(0);
        }).on('SIGINT', function() {
            console.log('\n');
            rl.close();
        });
    }
    
    function onMessage(json) {
        if (json) {
            log(json.stdout);
            logError(json.stderr);
            
            if (json.path)
                rl.setPrompt(json.path + '> ');
        }
    }
    
    function log(data) {
        if (data)
            console.log(data);
    }
    
    function logError(data) {
        if (data)
            console.error(data);
    }
})();
