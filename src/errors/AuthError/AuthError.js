import MessengerError from '../MessengerError.js';

class AuthError extends MessengerError {
    constructor(message) {
        super(message);
        this.info = {
            name: "AuthError",
            message: "Incorrect authorization data."
        };
    }
}
export default AuthError;