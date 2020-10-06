class Controller {
    constructor(tag) {
        this.tag = tag;
    }

    getMessagesWithUser(userTag, startIndex = 0, endIndex = 100) {

        const res = `got messages from ${userTag}`;
        return res;
    }

    getDialogsList(startIndex = 0, endIndex = 30) {
        const res = "got dialogs list";
        return res;
    }

    sendMessageToUser(userTag, message) {
        const res = `sent message ${message} to ${userTag}`;
        return res;
    }
}

export default Controller;