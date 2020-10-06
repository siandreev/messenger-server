import JsonRpcError from "./JsonRpcError.js";

class ArgumentsError extends JsonRpcError {
    constructor(message) {
        super(message);

        this.info = {
            name: "ArgumentsError",
            message: "Invalid params",
            code: -32602
        }
    }
}

export default ArgumentsError;