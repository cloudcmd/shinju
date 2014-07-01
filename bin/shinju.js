#!/usr/bin/env node

(function() {
    'use strict';
    
    var shinju  = require('../shinju'),
        url     = process.argv[2];
    
    if (!url)
        console.log('shinju <url>');
    else
        shinju.connect(url);
    
})();
