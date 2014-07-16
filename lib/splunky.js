var request     = Npm.require('request');
var os          = Npm.require('os');
var util        = Npm.require('util');
var winston     = Npm.require('winston');

/*
 * Constructor.  Create state in the object
 * @param access_token - apiKey, project_id, server_hostname - API Hostname
 *       
*/
var Log = function( access_token, project_id, server_hostname ) {
    this.access_token = access_token;
    this.project_id = project_id;
    this.url = "https://" + server_hostname + "/1/inputs/http" ; 
};

/* 
** Send log data to Storm.  Calls a callback that looks like:
**
** function(err, response, data)
**
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
        console.log( "Splunky could not connect to Splunkstorm server\n" + ex + "\n");
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
* @param msg {string} Message to log
* @param meta {Object} **Optional** Additional metadata to attach
* @param callback {function} Continuation to respond to when complete.
*/
SplunkStorm.prototype.logException = function ( msg, meta, callback ) {
    this.storm.send( "Exception " + msg, this.options.sourcetype, this.options.host, this.options.source, function( err ) {

        callback( err, !err );

    });
};


