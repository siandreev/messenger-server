import WebSocket from 'ws';
import attachUser from "../middlewares/attachUser.js";
import extractToken from "../middlewares/extractToken.js";
import JsonRpcParser from "../controller/JsonRpcParser.js";
import Controller from "../controller/Controller.js"
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";
import ClientsInfo from "../controller/ClientsInfo.js";
import getCurrentIp from "../libs/getCurrentIp.js";

const wsHost = global.appConfig.webSocket.host || getCurrentIp();
const wsPort = global.appConfig.webSocket.port || 8001;

const webSocketServer = new WebSocket.Server( {host: wsHost,port: wsPort});

webSocketServer.on('connection', function(ws, req) {
    extractToken(req, null,
        () => attachUser(req, ws,
            () => allowAccess(ws, req)));
});

const clientsInfo = new ClientsInfo();

function allowAccess(ws, req) {
    const parser = new JsonRpcParser();

    try {
        const user = req.currentUser;
        clientsInfo.addClient(user.tag, ws);
        clientsInfo.notifyAboutOnline(user.tag);

        ws.on('message', function (msg) {
            try {
                const info = clientsInfo.getClientByTag(user.tag);
                if (!info) {
                    throw new JsonRpcError();
                }
                parser.parseRequest(msg);
                parser.executeMethod(info.controller).then(response => {
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

        ws.on('close', function () {
            clientsInfo.notifyAboutOffline(user.tag).finally(() =>
                clientsInfo.removeClient(user.tag)
            );
        });

    } catch (e) {
        if (e instanceof JsonRpcError) {
            ws.close(parser.stringifyError(e));
        } else {
            ws.close(parser.stringifyError(new JsonRpcError()));
        }
    }
}