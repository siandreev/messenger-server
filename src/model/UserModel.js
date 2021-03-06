import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    salt: {
        type: String,
        required: true,
    }
});

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;