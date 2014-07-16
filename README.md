Splunkstorm integration for Meteor
================================================

Splunkstorm is a smart package for [Splunkstorm](https://www.splunkstorm.com)

Credits
=======

Thanks to Clint Sharp for the [Splunkstorm NPM](https://github.com/coccyx/splunkstorm) and Nicolas Herment for the [Winston-Splunkstorm NPM](https://github.com/nherment/winston-splunkstorm)

Quick start
===========

Dependencies
------------

This package depends on the [winston -  see documentation](https://github.com/flatiron/winston)

    

Install
-------

    mrt add splunk-storm


Use
---

    var logger = Winston;

    logger.add( SplunkStorm, {
        apiKey: "ACCESS_TOKEN",
        projectId: "PROJECT_ID",
        serverHostname: "API_HOSTNAME" //Eg. "api-XXX-XXXX.data.splunkstorm.com"
    });

    logger.info("Hello Splunk Storm");



License
=======

The MIT License (MIT)

Copyright (c) 2014 [Cinergix Pty. Ltd.](http://www.cinergix.com)

Copyright (c) 2013 Nicolas Herment

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
