import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import UserModel from '../model/UserModel.js';

import IncorrectPasswordError from "../errors/AuthError/IncorrectPasswordError.js";
import AccountNotExistError from "../errors/AuthError/AccountNotExistError.js";
import UserAlreadyExistError from "../errors/SignUpError/UserAlreadyExistError.js";

class AuthService {
    async Login(email, password) {
        const userRecord = await UserModel.findOne({ email });
        if (!userRecord) {
            throw new AccountNotExistError();
        } else {
            const correctPassword = await argon2.verify(userRecord.password, password);
            if (!correctPassword) {
                throw new IncorrectPasswordError();
            }
        }

        return {
            user: {
                email: userRecord.email,
                tag: userRecord.tag,
                firstName: userRecord.firstName,
                lastName: userRecord.lastName
            },
            token: this.generateJWT(userRecord),
        }
    }

    async SignUp(tag, firstName, lastName, email, password) {
        const salt = randomBytes(32);
        const passwordHashed = await argon2.hash(password, { salt });

        try {
            const userRecord = await UserModel.create({
                tag,
                firstName,
                lastName,
                email,
                password: passwordHashed,
                img: "default.jpg",
                salt: salt.toString('hex')
            });
            const token = this.generateJWT(userRecord);
            return {
                user: {
                    email: userRecord.email,
                    name: userRecord.name,
                },
                token
            }
        } catch (e) {
            throw new UserAlreadyExistError();
        }
    }

    generateJWT(user) {
        return jwt.sign({
            data: {
                _id: user._id,
                tag: user.tag,
                email: user.email
            }
        }, global.appConfig.JWT.privateKey, { expiresIn: global.appConfig.JWT.expiresIn });
    }
}

export default AuthService;