import AuthError from "./AuthError.js";

class NoAuthDataProvidedError extends AuthError {
    constructor(message) {
        super(message);
        this.info = {
            name: "NoAuthDataProvidedError",
            message: "Data required for authorization is missing."
        }
    }
}

export default NoAuthDataProvidedError;