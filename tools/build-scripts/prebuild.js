// import the jsonfile library
const jsonfile = require('jsonfile');
// store the path to the config file
const configFilePath = '../../config/config.json';
// open the config.json file
let configObject = require(configFilePath);

// ensure the offlineDevelopmentMode is set to false
configObject.offlineDevelopmentMode = false;

// write over the original file with the new object
jsonfile.writeFileSync(configFilePath, configObject, {spaces: 2, EOL: '\r\n'});
