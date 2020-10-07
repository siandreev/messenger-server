import UserModel from "../model/UserModel.js";
import MessageModel from "../model/MessagesModel.js";
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";
import ArgumentsError from "../errors/JsonRpcError/ArgumentsError.js";

class Controller {
    constructor(tag) {
        this.tag = tag;
    }

    async getMessagesWithUser(receiverTag, startIndex = 0, endIndex = 100) {
        if (typeof startIndex !== "number" || typeof endIndex !== "number" || startIndex >= endIndex) {
            throw new ArgumentsError();
        }
        const messages = await MessageModel.find({receiverTag, senderTag: this.tag}, ).skip(startIndex).limit(endIndex);
        return messages;
    }

    async getDialogsList(startIndex = 0, endIndex = 30) {
        if (typeof startIndex !== "number" || typeof endIndex !== "number" || startIndex >= endIndex) {
            throw new ArgumentsError();
        }
        const dialogs = await MessageModel.aggregate(
            [
                {
                    $match:
                        {
                            receiverTag: `${this.tag}`
                        }
                },
                {
                    $sort: {
                        "date": 1
                    }
                },
                {
                    $group:
                        {
                            _id: "$senderTag",
                            senderTag: {$last: "$senderTag"},
                            receiverTag: {$last: "$receiverTag"},
                            date: { $last: "$date" },
                            text: {$last: "$text"}
                        }
                },
                {
                    $sort: {
                        "date": -1
                    }
                },
            ]
        ).skip(startIndex).limit(endIndex);
        return dialogs;
    }

    async sendMessageToUser(receiverTag, text) {
        const userByTag = await UserModel.find({tag: receiverTag}).limit(1);

        if (!userByTag.length || receiverTag === this.tag) {
            throw new ArgumentsError();
        }

        const success = await MessageModel.create({
            senderTag: this.tag,
            receiverTag,
            text,
            date: Date.now()
        })
        if (!success) {
            throw new JsonRpcError();
        }
        const res = `sent "${text}" to ${receiverTag}`;
        return res;
    }
}

export default Controller;