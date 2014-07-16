Package.describe({
  summary: "Splunkstorm intergration for Meteor"
});

Npm.depends({
  'winston': '0.7.3',
  'request': '2.2.0',
  'util': '0.10.3'
});

Package.on_use(function (api, where) {

    api.export(['SplunkStorm'] , 'server');
    api.add_files([
    	'lib/splunky.js'
    ], 'server');
    
});
