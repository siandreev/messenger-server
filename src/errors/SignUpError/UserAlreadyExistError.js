import SignUpError from './SignUpError.js';

class UserAlreadyExistError extends SignUpError {
    constructor(message) {
        super(message);
        this.info = {
            name: "UserAlreadyExistError",
            message: "Such user already exists."
        }
    }
}

export default UserAlreadyExistError;