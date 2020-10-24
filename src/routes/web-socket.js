import attachUser from "../middlewares/attachUser.js";
import extractToken from "../middlewares/extractToken.js";
import JsonRpcParser from "../controller/JsonRpcParser.js";
import JsonRpcError from "../errors/JsonRpcError/JsonRpcError.js";
import ClientsInfo from "../controller/ClientsInfo.js";

export default function(app) {
    const wsPath = global.appConfig.webSocket.path || "/api";
    app.use(wsPath, extractToken, attachUser);

    const clientsInfo = new ClientsInfo();

    app.ws(wsPath,  (ws, req) => {
        try {
            const user = req.currentUser;
            clientsInfo.addClient(user.tag, ws);
            clientsInfo.notifyAboutOnline(user.tag);

            ws.on('message', msg => {
                const parser = new JsonRpcParser();
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
                ws.close(JsonRpcParser.stringifyError(e));
            } else {
                ws.close(JsonRpcParser.stringifyError(new JsonRpcError()));
            }
        }
    });
}