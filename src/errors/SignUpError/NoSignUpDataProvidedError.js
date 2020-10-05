import SignUpError from "./SignUpError.js";

class NoSignUpDataProvidedError extends SignUpError {
    constructor(message) {
        super(message);
        this.info = {
            name: "NoSignUpDataProvidedError",
            message: "Data required for sign up is missing."
        }
    }
}

export default NoSignUpDataProvidedError;