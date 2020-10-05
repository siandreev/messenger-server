import AuthError from "./AuthError.js";

class IncorrectPasswordError extends AuthError {
    constructor(message) {
        super(message);
    }
}

export default IncorrectPasswordError;