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
        const dialogs =  await Controller.getDialogsList(this.tag, startIndex, endIndex);
        const onlineUsersTagsList = this.clientsInfo.getOnlineUsersTagsList();

        for(let dialog of dialogs) {
            dialog.userInfo._doc.isOnline = onlineUsersTagsList.includes(dialog.userInfo.tag);
        }

        return dialogs;
    }

    async sendMessageToUser(receiverTag, text) {
        const result = await Controller.sendMessageToUser(this.tag, receiverTag, text);
        if (result.status === "OK") {
            this.clientsInfo.sendMessage(result.message.senderTag, result.message.receiverTag,
                result.message.text, result.message.date)
        }
        return result;
    }

    async getSelfInfo() {
        return await Controller.getSelfInfo(this.tag);
    }

    async setSelfInfo(firstName, lastName) {
        return await Controller.setSelfInfo(this.tag, firstName, lastName);
    }
}

export default ClientController;