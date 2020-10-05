import MessengerError from '../MessengerError.js';

class SignUpError extends MessengerError {
    constructor(message) {
        super(message)
    }
}

export default SignUpError;