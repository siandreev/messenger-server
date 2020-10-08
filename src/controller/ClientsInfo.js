import ClientController from "./ClientController.js";
import Controller from "./Controller.js";

class ClientsInfo {
    constructor() {
        this.clients = [];
    }

    addClient(tag, ws) {
        if (this.clients.find(client => client.tag === tag)) {
            this.clients = this.clients.filter(client => client.tag !== tag);
        }

        this.clients.push({ tag, ws, controller: new ClientController(this, tag) });
    }

    removeClient(tag) {
        this.clients = this.clients.filter(client => client.tag !== tag);
    }

    getClientByTag(tag) {
        return this.clients.find(client => client.tag === tag);
    }

    sendMessage(senderTag, receiverTag, text, date) {
        const receiverInfo = this.getClientByTag(receiverTag);
        if (receiverInfo) {
            const response = JSON.stringify(
                {
                    type: "newMessage",
                    code: 3001,
                    body: {
                        senderTag,
                        receiverTag,
                        text,
                        date
                    }
                }
            )
            receiverInfo.ws.send(response);
        }
    }

    async notifyAboutOnline(loggedInUserTag) {
        await this.sendInfoToAllUserContacts(loggedInUserTag, {
            type: "contactOnline",
            code: 3101,
            body: {
                loggedInUserTag
            }
        });
    }

    async notifyAboutOffline(loggedOutUserTag) {
        await this.sendInfoToAllUserContacts(loggedOutUserTag, {
            type: "contactOffline",
            code: 3100,
            body: {
                loggedOutUserTag
            }
        });
    }

    async notifyAboutUserPersonalDataChanges(userTag, newData) {
        const info = {
            type: "contactPersonalDataChanges",
            code: 3200,
            body: newData
        };
        await this.sendInfoToAllUserContacts(userTag, info);
    }

    async sendInfoToAllUserContacts(userTag, info) {
        let contactsTags = await Controller.getContactsList(userTag);
        contactsTags =Array.from(new Set(contactsTags));

        this.clients.forEach(onlineUser => {
            if (contactsTags.includes(onlineUser.tag)) {
                const response = JSON.stringify(info)
                onlineUser.ws.send(response);
            }
        })
    }

    getOnlineUsersTagsList() {
        return this.clients.map(client => client.tag);
    }
}

export default ClientsInfo;