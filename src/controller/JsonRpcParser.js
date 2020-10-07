import FormatError from "../errors/JsonRpcError/FormatError.js";
import ParseError from "../errors/JsonRpcError/ParseError.js";
import MissingMethodError from "../errors/JsonRpcError/MissingMethodError.js";
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";

class JsonRpcParser {
    parseRequest(json) {
        let request;

        try {
            request = JSON.parse(json);
        } catch (e) {
            throw new ParseError();
        }

        if (!request.jsonrpc || !request.method || !request.id) {
            throw new FormatError();
        }

        this.id = request.id;
        this.method = request.method;
        this.params = request.params;
        return request;
    }

    async executeMethod(obj) {
        const method = this.method.toString();
        if (!Object.getPrototypeOf(obj).hasOwnProperty(method) || (typeof obj[method] !== "function")) {
            throw new MissingMethodError()
        }

        try {
            let result;
            if (this.params) {
               result = Array.isArray(this.params) ? await obj[method](...this.params) : await obj[method](this.params)
            } else {
                result = await obj[method]();
            }
            return this.stringifyResult(result);

        } catch (e) {
            if (e instanceof JsonRpcError) {
                throw e;
            } else {
                throw  new JsonRpcError();
            }
        }
    }

    stringifyError(err) {
        return JSON.stringify(
            {
                    jsonrpc: 2.0,
                    error: {
                        code: err.info.code,
                        message: err.info.message
                    },
                    id: this.id === undefined ? null : this.id
                 }
            )
    }

    stringifyResult(result) {
        return JSON.stringify(
            {
                jsonrpc: 2.0,
                result,
                id: this.id === undefined ? null : this.id
            }
        )
    }

}

export default JsonRpcParser;