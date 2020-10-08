import fs from 'fs';

const config = JSON.parse(fs.readFileSync(process.cwd() + '/config.json', 'utf8'));
global.appConfig = config;