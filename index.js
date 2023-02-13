const request = require('request'),
      { writeFileSync } = require('fs');

const config = require('./config.json');
const ModList = require('./ModList.json');

if(!config.API_KEY) { // APIKeyがあるか確認
    console.log("Please put the Api Key!");
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
console.log('Starting Download...');

for(let mods of ModList.ModList) {
    let FileAPI = `${BaseURL}/v1/mods/${mods.ProjectID}/files/${mods.FileID}`;
    let ModAPI = `${BaseURL}/v1/mods/${mods.ProjectID}`

    request(FileAPI, Headers, function(error, response, body) {
        if(error) return console.log(error)
        request(ModAPI, Headers, function(e, r, b) {
            if(e) return console.log(e)
            request(body.data.downloadUrl, {
                encoding: null
            }, function(er, re, bo) {
                if(er) return console.log(er)
                if(config.DOWNLOAD_FOLDER) {
                    if(config.DOWNLOAD_FOLDER.slice(-2) === '\\') {
                        writeFileSync(config.DOWNLOAD_FOLDER + body.data.fileName, bo);
                    } else {
                        writeFileSync(config.DOWNLOAD_FOLDER + '\\' + body.data.fileName, bo);
                    }
                } else {
                    writeFileSync('./Mods/' + body.data.fileName, bo);
                }
                console.log('Download is Completed: "' + b.data.name + '"')
            })
        })
    })
}