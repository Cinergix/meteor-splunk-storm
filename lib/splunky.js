/*
 * Splunkstorm
 * ===========
 * 
 * SplunkStorm smart package act as a transport for the winston to Splunk Storm.
 * It logins to the Splunk storm and allows to send log data from winston to the 
 * server.
 * 
 * =================================================================================
 * 
 * This file uses certain portion of code from the Splunktorm NPM (http://https://www.npmjs.org/package/splunkstorm)
 * and Winston-Splunkstorm NPM (https://www.npmjs.org/package/winston-splunkstorm) 
 * by Nicolas Herment
 *
 * LICENSE
 * =======
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Nicolas Herment
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 * ================================================================================
 * 
 */

var request     = Npm.require('request');
var os          = Npm.require('os');
var util        = Npm.require('util');
var winston     = Npm.require('winston');

/*
 * Constructor.  Create state in the object
 * @param access_token    {String} The access token of Splunkstorm project
 * @param project_id      {String} The Splunkstorm project ID
 * @param server_hostname {String} The API Hostname of Splunkstorm project
 *
 * @type {Function}
 * 
 */
var Log = function( access_token, project_id, server_hostname ) {
    this.access_token = access_token;
    this.project_id = project_id;
    this.url = "https://" + server_hostname + "/1/inputs/http" ; 
};

/* 
 * Send log data to Storm.  
 * Calls a callback that looks like: function(err, response, data)
 * 
 * @param eventtext  {object}   - Event text
 * @param sourcetype {String}   - Type of log. Default : `sysLog`
 * @param host       {String}   - The Hostname of the server
 * @param source     {Object}   - The log
 * @param callback   {function} - The callback function
 * 
 * @type {Function}
 * 
 */
Log.prototype.send = function( eventtext, sourcetype, host, source, callback ) {
    sourcetype = typeof sourcetype !== 'undefined' ? sourcetype : 'syslog';
    callback = typeof callback === 'function' ? callback : function () { };

    params = { 'project' : this.project_id,
                'sourcetype' : sourcetype };
    if ( typeof host !== 'undefined' ) {
        params['host'] = host;
    }
    if ( typeof source !== 'undefined' ) {
        params['source'] = source;
    }
    
    var urlarr = [ ];
    for ( var key in params ) {
        urlarr.push( encodeURIComponent( key ) + '=' + encodeURIComponent( params[key] ) );
    }
    var url = this.url + '?' + urlarr.join('&');
    
    if ( typeof eventtext === 'object' ) {
        eventtext = JSON.stringify( eventtext );
    }
    
    var options = {
        maxSockets: 1,
        url: url,
        method: 'POST',
        body: eventtext,
        headers: {
            Authorization: "Basic " + new Buffer(":" + this.access_token).toString("base64")
        }
    };
    
    try {
        request( options, callback );
    }
    catch ( ex ) {
        console.log( "ERROR: Splunkstorm could not connect to the server\n" + ex + "\n");
        callback( ex );
    }
};


/**
 * @param options {
 *     "apiKey": "",
 *     "projectId": "",
 *     "serverHostname": "",
 *     "level": "info",
 *     "sourcetype": undefined,
 *     "host": <os.hostname()>,
 *     "source": undefined
 * }
 *
 * @type {Function}
 * 
 */
SplunkStorm = winston.transports.SplunkStorm = function ( options ) {

    this.name = 'SplunkStorm';

    this.level = options.level || 'info';

    if( typeof options.host === 'undefined' ) {
        options.host = os.hostname();
    }

    this.options = options;

    this.storm = new Log( options.apiKey, options.projectId, options.serverHostname );
};


util.inherits( SplunkStorm, winston.Transport );

/* 
 * Logs the specified `level`, `msg`, `meta` and responds to the callback once the log
 * operation is complete to ensure that the event loop will not exit before
 * all logging has completed.
 * 
 * @param level    {string}   The level of log - Default is `info`
 * @param msg      {string}   Message to log
 * @param meta     {Object}   **Optional** Additional metadata to attach
 * @param callback {function} Continuation to respond to when complete.
 *
 * @type {Function}
 * 
 */
SplunkStorm.prototype.log = function ( level, msg, meta, callback ) {
    this.storm.send( level + " " + msg, this.options.sourcetype, this.options.host, this.options.source, function( err ) {

        callback( err, !err );

    });

};

/*
 * Logs the specified `msg`, `meta` and responds to the callback once the log
 * operation is complete to ensure that the event loop will not exit before
 * all logging has completed.
 *
 * @param msg      {string}   Message to log
 * @param meta     {Object}   **Optional** Additional metadata to attach
 * @param callback {function} Continuation to respond to when complete.
 *
 * @type {Function}
 * 
 */
SplunkStorm.prototype.logException = function ( msg, meta, callback ) {
    this.storm.send( "Exception " + msg, this.options.sourcetype, this.options.host, this.options.source, function( err ) {

        callback( err, !err );

    });
};


