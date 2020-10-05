import AuthError from "./AuthError.js";

class AccountNotExistError extends AuthError {
    constructor(message) {
        super(message);
    }
}

export default AccountNotExistError;