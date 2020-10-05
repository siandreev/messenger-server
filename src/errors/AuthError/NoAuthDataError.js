import AuthError from "./AuthError.js";

class NoAuthDataError extends AuthError {
    constructor(message) {
        super(message);
        this.info = {
            name: "NoAuthDataError",
            message: "Authorization data missing."
        };
    }
}

export default NoAuthDataError;