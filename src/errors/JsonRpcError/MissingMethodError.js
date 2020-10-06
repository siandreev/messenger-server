import JsonRpcError from "./JsonRpcError.js";

class MissingMethodError extends JsonRpcError {
    constructor(message) {
        super(message);

        this.info = {
            name: "MissingMethodError",
            message: "Method not found",
            code: -32601
        }
    }
}

export default MissingMethodError;