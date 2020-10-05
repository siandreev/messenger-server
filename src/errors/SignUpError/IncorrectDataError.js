import SignUpError from "./SignUpError.js";

class IncorrectDataError extends SignUpError {
    constructor(message) {
        super(message);
        this.info = {
            name: "IncorrectDataError",
            message: "Incorrect parameter values passed."
        }
    }
}

export default IncorrectDataError;