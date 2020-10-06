import AuthError from "./AuthError.js";

class NoAuthJWTError extends AuthError {
    constructor(message) {
        super(message);
        this.info = {
            name: "NoAuthJWTError",
            message: "Authorization data missing."
        };
    }
}

export default NoAuthJWTError;