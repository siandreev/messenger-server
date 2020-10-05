class MessengerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.info = {
            name: "Server error",
            message: "An unhandled server error has occurred"
        }
    }

    static PrepareResponse(e) {
        if (e instanceof MessengerError) {
            return (
                {
                    code: 401,
                    json: {
                        Error: e.info
                    }
                }
            )

        } else {
            return (
                {
                    code: 500,
                    json: {
                        Error: {
                            name: "UnspecifiedError",
                            message: "An undefined error occurred on the server."
                        }
                    }
                }
            )
        }
    }
}

export default MessengerError;