import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    senderTag: {
        type: String,
        required: true
    },
    receiverTag: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    conversationId: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean
    }
});

const MessageModel = mongoose.model('message', MessagesSchema);

export default MessageModel;