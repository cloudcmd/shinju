(function() {
    'use strict';
    
    var io              = require('socket.io-client'),
        readline        = require('readline'),
        
        rl,
            
        CHANNEL     = 'console-data';
    
    exports.connect = connect;
    
    function connect(url) {
        var socket      = io(url);
        
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
            process.exit();
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
