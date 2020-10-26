import MessengerError from "../MessengerError.js";

class FilesLimitExceedingError extends MessengerError {
    constructor(message) {
        super(message);
        this.info = {
            name: "FilesLimitExceedingError",
            message: "File upload limit has been exceeded"
        };
    }
}

export default FilesLimitExceedingError;