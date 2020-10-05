import NoSignUpDataProvidedError from "../errors/SignUpError/NoSignUpDataProvidedError.js";
import IncorrectDataError from "../errors/SignUpError/IncorrectDataError.js";

export default async (req, res, next) => {
    if (!req.body || !req.body.user || !req.body.user.tag || !req.body.user.firstName ||
        !req.body.user.lastName || !req.body.user.email || !req.body.user.password) {
        throw new NoSignUpDataProvidedError()
    }
    const user = req.body.user;
    if (!isTagCorrect(user.tag) || !isFirstNameCorrect(user.firstName) || !isLastNameCorrect(user.lastName) ||
        !isEmailCorrect(user.email) || !isPasswordCorrect(user.password)) {
            throw new IncorrectDataError();
    }
    return next();
}

//TODO add regex conditions

function isTagCorrect(tag) {
    return tag.length >= 1;
}

function isFirstNameCorrect(firstName) {
    return firstName.length >= 2;
}

function isLastNameCorrect(lastName) {
    return lastName.length >= 2;
}

function isEmailCorrect(email) {
    const regExp = /\S+@\S+\.\S+/;
    return regExp.test(email);
}

function isPasswordCorrect(password) {
    return password.length >= 5;
}