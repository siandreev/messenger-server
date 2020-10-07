import UserModel from "../model/UserModel.js";
import MessageModel from "../model/MessagesModel.js";
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";
import ArgumentsError from "../errors/JsonRpcError/ArgumentsError.js";
import ConversationModel from "../model/ConversationModel.js";

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
                            $or: [{receiverTag: userTag}, {senderTag: userTag}]
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
                            _id: "$conversationId",
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

        const conversationId = await Controller.addConversationIfNotExist(senderTag, receiverTag);

        const success = await MessageModel.create({
            senderTag,
            receiverTag,
            text,
            date: Date.now(),
            conversationId
        })
        if (!success || success.errors) {
            throw new JsonRpcError();
        }

        return {
            status :"OK",
            message: {
                senderTag,
                receiverTag,
                text,
                date: Date.now(),
            }
        };
    }

    static async getContactsList(userTag) {
        const dialogs = await MessageModel.aggregate(
            [
                {
                    $match:
                        {
                            $or: [{receiverTag: userTag}, {senderTag: userTag}]
                        }
                },
                {
                    $group:
                        {
                            _id: "$conversationId",
                            senderTag: {$last: "$senderTag"},
                            receiverTag: {$last: "$receiverTag"},
                        }
                }
            ]
        );
        return dialogs.map(dialog => dialog.senderTag === userTag ? dialog.receiverTag : dialog.senderTag );
    }

    static async getConversationIdByTags(user1Tag, user2Tag) {
        const conversation = await ConversationModel.find()
            .or([{user1Tag, user2Tag}, {user1Tag: user2Tag, user2Tag: user1Tag}])
        if (!conversation.length || !conversation[0] || !conversation[0].id) {
            throw new JsonRpcError();
        }
        return conversation[0].id;
    }

    static async addConversationIfNotExist(user1Tag, user2Tag) {
        const conversation = await ConversationModel.find()
            .or([{user1Tag, user2Tag}, {user1Tag: user2Tag, user2Tag: user1Tag}])
        if (!conversation.length) {
            const newConversation = await ConversationModel.create({user1Tag, user2Tag});
            if (!newConversation || newConversation.errors) {
                throw new JsonRpcError();
            }
            return newConversation.id;
        }
        return conversation[0].id;
    }
}

export default Controller;