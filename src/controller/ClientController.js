import Controller from "./Controller.js";

class ClientController {
    constructor(clientsInfo, tag) {
        this.tag = tag;
        this.clientsInfo = clientsInfo;
    }

    async getMessagesWithUser(receiverTag, startIndex = 0, endIndex = 100) {
        return await Controller.getMessagesWithUser(this.tag, receiverTag, startIndex, endIndex);
    }

    async getDialogsList(startIndex = 0, endIndex = 30) {
        return await Controller.getDialogsList(this.tag, startIndex, endIndex);
    }

    async sendMessageToUser(receiverTag, text) {
        const result = await Controller.sendMessageToUser(this.tag, receiverTag, text);
        if (result.status === "OK") {
            this.clientsInfo.sendMessage(result.message.senderTag, result.message.receiverTag,
                result.message.text, result.message.date)
        }
        return result;
    }
}

export default ClientController;