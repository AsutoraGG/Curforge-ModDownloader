const request = require('request'),
      { writeFileSync, createWriteStream } = require('fs');

const config = require('./config.json');
const ModList = require('./ModList.json');

if(!config.API_KEY) { // APIKeyがあるか確認
    console.log("Please put the Api Key!")
    console.log("How to get API KEY? -> https://console.curseforge.com/#/api-keys")
    process.exit();
}

const BaseURL = "https://api.curseforge.com";

const Headers = {
    method: 'GET',
    json: true,
    headers: {
        'x-api-key': config.API_KEY
    }
}

console.clear();

for(let mods of ModList.ModList) {
    let FileAPI = `${BaseURL}/v1/mods/${mods.ProjectID}/files/${mods.FileID}`;
    let ModAPI = `${BaseURL}/v1/mods/${mods.ProjectID}`

    request(FileAPI, Headers, function(error, response, body) {
        request(ModAPI, Headers, function(e, r, b) {
            //console.log('Starting Download: "' + b.data.name + '"')
            request(body.data.downloadUrl, {
                encoding: null
            }, function(er, re, bo) {
                writeFileSync(body.data.fileName, bo);
                console.log('Download is Completed: "' + b.data.name + '"')
            })
        })
    })
}