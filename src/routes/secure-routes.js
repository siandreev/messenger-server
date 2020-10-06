export default (app) => {
    app.get('/', async (req, res) => {
        const __dirname = process.cwd();
        res.sendFile('src/test.html', {root: __dirname })
    })
}