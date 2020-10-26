import FilesLimitExceedingError from "../errors/FileError/FilesLimitExceedingError.js";

const tags = {};
const ips = {};
const maxFilesCount = 10;
const interval = 60 * 1000;

export default async function (req, ws, next) {
    const tag = req.currentUser.tag;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddres;
    if (!tags[tag] && !ips[ip]) {
        tags[tag] = [Date.now()];
        if (ip) {
            ips[ip] = [Date.now()];
        }
        return next();
    }

    tags[tag] = tags[tag] || [];

    const now = Date.now();
    const tagAbleToUpload = tags[tag].filter(date => now - date <= interval).length < maxFilesCount;
    let ipAbleToUpload = true;

    if (ip) {
        ips[ip] = ips[ip] || [];
        ipAbleToUpload = ips[ip].filter(date => now - date <= interval).length < maxFilesCount;
    }

    if (tagAbleToUpload && ipAbleToUpload) {
        tags[tag].push(now);
        ips[ip].push(now);
        return next();
    }

    throw new FilesLimitExceedingError();
}