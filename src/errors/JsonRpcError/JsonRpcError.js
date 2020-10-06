import MessengerError from "../MessengerError.js";

class JsonRpcError extends MessengerError {
    constructor(message) {
        super(message);

        this.info = {
            name: "JsonRpcError",
            message: "Server error",
            code: -32000
        }
    }
}

export default JsonRpcError;