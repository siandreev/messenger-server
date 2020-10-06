import JsonRpcError from "./JsonRpcError.js";

class ParseError extends JsonRpcError {
    constructor(message) {
        super(message);

        this.info = {
            name: "ParseError",
            message: "Parse error",
            code: -32700
        }
    }
}

export default ParseError;