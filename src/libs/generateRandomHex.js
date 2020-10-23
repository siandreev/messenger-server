export default function (digits = 32) {
    return [...Array(digits)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}