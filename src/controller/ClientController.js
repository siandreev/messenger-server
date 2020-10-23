import fs from "fs";
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

    async setSelfInfo(firstName, lastName, img) {
        const currentUserData = await Controller.getSelfInfo(this.tag);
        const isFirstNameValid = firstName === "" || isFirstNameCorrect(firstName);
        const isLastNameValid = lastName === "" || isLastNameCorrect(lastName);
        const isImgValid = img === "" || fs.existsSync(process.cwd() + "/public/img/" + img);
        if (!isFirstNameValid || !isLastNameValid || !isImgValid) {
            throw new ArgumentsError();
        }

        const hasFirstNameBeenUpdated = firstName && firstName !== currentUserData.firstName;
        const hasLastNameBeenUpdated = lastName && lastName !== currentUserData.lastName;
        const hasImgBeenUpdated = img && img !== currentUserData.img;
        if (!hasFirstNameBeenUpdated && !hasLastNameBeenUpdated && !hasImgBeenUpdated) {
            throw new ArgumentsError();
        }

        const updated = await Controller.setSelfInfo(this.tag, firstName, lastName, img);
        const newData = {
            tag : this.tag
        };
        if (hasFirstNameBeenUpdated) {
            newData.firstName = firstName;
        }
        if (hasLastNameBeenUpdated) {
            newData.lastName = lastName;
        }
        if (hasImgBeenUpdated) {
            newData.img = img;
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