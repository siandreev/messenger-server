import Controller from "./Controller.js";
import {isTagCorrect, isFirstNameCorrect, isLastNameCorrect, isEmailCorrect, isPasswordCorrect} from '../libs/verifyUserData.js'
import ArgumentsError from "../errors/JsonRpcError/ArgumentsError.js";

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
        const currentUserData = await Controller.getSelfInfo(this.tag);
        if ((firstName !== "" && !isFirstNameCorrect(firstName))
            || (lastName !== "" && !isFirstNameCorrect(lastName))
            || (firstName === "" && lastName === "")
            || (firstName === "" && lastName === currentUserData.lastName)
            || (lastName === "" && firstName === currentUserData.firstName)
            || (firstName === currentUserData.firstName && lastName === currentUserData.lastName)) {
            throw new ArgumentsError();
        }
        const updated = await Controller.setSelfInfo(this.tag, firstName, lastName);
        const newData = {
            tag : this.tag
        };
        if (firstName && firstName !== currentUserData.firstName) {
            newData.firstName = firstName;
        }
        if (lastName && lastName !== currentUserData.lastName) {
            newData.lastName = lastName;
        }
        await this.clientsInfo.notifyAboutUserPersonalDataChanges(this.tag, newData);
        return updated;
    }

    async markMessagesWithUserAsRead(senderTag) {
        const status = Controller.markMessagesWithUserAsRead(this.tag, senderTag);
        await this.clientsInfo.notifyAboutMessagesWasRead(senderTag, this.tag);
        return status;
    }

    async findUsersByTag(tag) {
        const users = await Controller.findUsersByTag(this.tag, tag);
        const onlineUsersTagsList = this.clientsInfo.getOnlineUsersTagsList();

        for(let user of users) {
            user._doc.isOnline = onlineUsersTagsList.includes(user.tag);
        }

        return users;

    }
}

export default ClientController;