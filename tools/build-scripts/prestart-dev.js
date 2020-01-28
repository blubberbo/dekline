// import the jsonfile library
const jsonfile = require('jsonfile');
// import the dns-sync library
const dnsSync = require('dns-sync');
// store the path to the config file
const configFilePath = '../../config/config.json';
// open the config.json file
let configObject = require(configFilePath);

// ping google.com to check if there is an internet connection
// if there is no internet, force the offline mode, else don't change the value
if (!dnsSync.resolve('google.com')) {
  // there is no internet connection
  // so we want to force offlineDevelopmentMode
  configObject.offlineDevelopmentMode = true;
};

// write over the original file with the new object
jsonfile.writeFileSync(configFilePath, configObject, {spaces: 2, EOL: '\r\n'});
