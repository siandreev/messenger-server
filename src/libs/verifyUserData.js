function isTagCorrect(tag) {
    return /^@[A-Za-z]+$/.test(tag);
}

function isFirstNameCorrect(firstName) {
    return /^[A-ZА-Я][a-zа-я]+$/.test(firstName);
}

function isLastNameCorrect(lastName) {
    return /^[A-ZА-Я][a-zа-я]+$/.test(lastName);
}

function isEmailCorrect(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

function isPasswordCorrect(password) {
    return password.length >= 5;
}

export {isTagCorrect, isFirstNameCorrect, isLastNameCorrect, isEmailCorrect, isPasswordCorrect}