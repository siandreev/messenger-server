import WebSocket from 'ws';
import attachUser from "../middlewares/attachUser.js";
import extractToken from "../middlewares/extractToken.js";
import JsonRpcParser from "../controller/JsonRpcParser.js";
import Controller from "../controller/Controller.js"
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";

const webSocketServer = new WebSocket.Server( {host: '127.0.0.1',port: 8001});

let clients = [];
webSocketServer.on('connection', function(ws, req) {
    extractToken(req, null,
        () => attachUser(req, ws,
            () => allowAccess(ws, req)));
});

function allowAccess(ws, req) {
    const user = req.currentUser;
    if (clients.find(client => client.tag === user.tag)) {
        clients = clients.filter(client => client.tag !== user.tag)
    }
    clients.push(
        {
            tag: user.tag,
            ws,
            controller: new Controller(user.tag)
        }
    )

    ws.on('message', function (msg) {
        const parser = new JsonRpcParser();
        try {
            const client = clients.find(client => client.tag === user.tag);

            if (!client) {
                throw new JsonRpcError();
            }

            parser.parseRequest(msg);
            parser.executeMethod(client.controller).then( response => {
                ws.send(response);
            }).catch(reason => {
                if (reason instanceof JsonRpcError) {
                    ws.send(parser.stringifyError(reason));
                } else {
                    ws.send(parser.stringifyError(new JsonRpcError()));
                }
            })


        } catch (e) {
            if (e instanceof JsonRpcError) {
                ws.send(parser.stringifyError(e));
            } else {
                ws.send(parser.stringifyError(new JsonRpcError()));
            }
        }

    });
}