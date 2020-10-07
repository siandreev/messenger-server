import ClientController from "./ClientController.js";

class ClientsInfo {
    constructor() {
        this.clients = [];
    }

    addClient(tag, ws) {
        if (this.clients.find(client => client.tag === tag)) {
            this.clients = this.clients.filter(client => client.tag !== tag);
        }

        this.clients.push({ tag, ws, controller: new ClientController(this, tag) });
    }

    removeClient(tag) {
        this.clients = this.clients.filter(client => client.tag !== tag);
    }

    getClientByTag(tag) {
        return this.clients.find(client => client.tag === tag);
    }

    sendMessage(senderTag, receiverTag, text, date) {
        const receiverInfo = this.getClientByTag(receiverTag);
        if (receiverInfo) {
            const response = JSON.stringify(
                {
                    type: "newMessage",
                    code: 3001,
                    body: {
                        senderTag,
                        receiverTag,
                        text,
                        date
                    }
                }
            )
            receiverInfo.ws.send(response);
        }
    }

    notifyAboutOnline(loggedInUserTag) {
        //TODO: implement online notification
    }

    notifyAboutOffline(loggedOutUserTag) {
        //TODO: implement offline notification
    }
}

export default ClientsInfo;