import JsonRpcError from "./JsonRpcError.js";

class FormatError extends JsonRpcError {
    constructor(message) {
        super(message);

        this.info = {
            name: "JsonRpcFormatError",
            message: "Invalid Request",
            code: -32600
        }
    }
}

export default FormatError;