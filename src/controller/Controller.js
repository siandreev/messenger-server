import UserModel from "../model/UserModel.js";
import MessageModel from "../model/MessagesModel.js";
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";
import ArgumentsError from "../errors/JsonRpcError/ArgumentsError.js";

class Controller {
    static async getMessagesWithUser(user1Tag, user2Tag, startIndex = 0, endIndex = 100) {
        if (!user1Tag ||!user2Tag || typeof startIndex !== "number" || typeof endIndex !== "number" || startIndex >= endIndex) {
            throw new ArgumentsError();
        }
        const messages = await MessageModel.find()
            .or([{receiverTag : user1Tag, senderTag: user2Tag}, {receiverTag : user2Tag, senderTag: user1Tag}])
            .sort([['date', -1]])
            .skip(startIndex)
            .limit(endIndex);
        return messages;
    }

    static async getDialogsList(userTag, startIndex = 0, endIndex = 30) {
        if (typeof startIndex !== "number" || typeof endIndex !== "number" || startIndex >= endIndex) {
            throw new ArgumentsError();
        }
        const dialogs = await MessageModel.aggregate(
            [
                {
                    $match:
                        {
                            receiverTag: userTag
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

    static async sendMessageToUser(senderTag, receiverTag, text) {
        const userByTag = await UserModel.find({tag: receiverTag}).limit(1);

        if (!receiverTag || !userByTag.length || receiverTag === senderTag) {
            throw new ArgumentsError();
        }

        const newMessage = {
            senderTag,
            receiverTag,
            text,
            date: Date.now()
        };

        const success = await MessageModel.create(newMessage)
        if (!success) {
            throw new JsonRpcError();
        }

        return {
            status :"OK",
            message: newMessage
        };
    }
}

export default Controller;