export default (app) => {
    app.get('/exit', (req, res) => {
        try {
            res.clearCookie('auth', {httpOnly:true, secure: false, hostOnly: true})
        } finally {
            res.status(200).send();
        }
    })
}