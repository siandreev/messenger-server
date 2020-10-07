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
    }
});

const MessageModel = mongoose.model('message', MessagesSchema);

export default MessageModel;