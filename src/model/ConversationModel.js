import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    user1Tag: {
        type: String,
        required: true
    },
    user2Tag: {
        type: String,
        required: true
    }
});

const ConversationModel = mongoose.model('conversation', ConversationSchema);

export default ConversationModel;