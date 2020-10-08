## messenger-server
Node js implementation of the server side for the messenger.

#### Capabilities
- Creation and saving in the database users based on tag (starts with "@"), first name, last name, email, password (The password is hashed with argon2).
- Authorization and saving JWT in cookies.
- Connecting clients who received a JWT via websockets.
- Execution of methods for working with messages and dialogs via json-rpc 2.0 (for example sending a message, getting a contact list, etc.).
- Notifying online customers (that is, customers with an open web socket) about new messages, users logging into the network from the contact list and changing their personal data.

#### Setting up and running
First, configure your application in config.json file and place it in the server root. The file should be in the following format:
```
{
  "JWT": {
    "expiresIn": "72h",
    "privateKey": "secret_private_key"
  },
  "cookie": {
    "maxAge": "72h"
  },
  "webSocket": {
    "host": "",
    "port": 8001
  },
  "app": {
    "port": 8000
  }
}
```
Next, install the necessary modules using ```yarn install``` and start the server.

#### Testing
For testing, go to the un address of your host in the local network in the browser, for example ```http://192.168.0.107:8000```

#### API
The server uses json-rpc 2.0 api (Batch requests are not supported yet). After you have authored (there was a cookie "auth" with a JWT), you can use the following methods:
```
getSelfInfo()
setSelfInfo(firstName, lastName)
sendMessageToUser(receiverTag, text)
getDialogsList(startIndex = 0, endIndex = 30)
getMessagesWithUser(receiverTag, startIndex = 0, endIndex = 100)
```

Requests examples:
```
--> {"jsonrpc": "2.0", "method": "getSelfInfo", "id": "1"}
<-- {"jsonrpc":2,"result":{"_id":"5f7b106bbed28f24c084c440","tag":"@siandreev","firstName":"Sergey","lastName":"Andreev"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "setSelfInfo", "params":["", "Ivanov"], "id": "1"}
<-- {"jsonrpc":2,"result":{"_id":"5f7b106bbed28f24c084c440","tag":"@siandreev","firstName":"Sergey","lastName":"Ivanov"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "setSelfInfo", "params":["123", "Ivanov"], "id": "1"}
<-- {"jsonrpc":2,"error":{"code":-32602,"message":"Invalid params"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "sendMessageToUser", "params": ["@admin", "hi, admin"], "id": "1"}
<-- {"jsonrpc":2,"result":{"status":"OK","message":{"senderTag":"@siandreev","receiverTag":"@admin","text":"hi, admin","date":1602158818458}},"id":"1"}

--> {"jsonrpc": "2.0", "method": "getDialogsList", "id": "1"}
<-- {"jsonrpc":2,"result":
        [
            {
                "_id":"5f7de7cd72b1c835f0090919",
                "senderTag":"@siandreev",
                "receiverTag":"@admin",
                "date":"2020-10-08T12:06:58.447Z",
                "text":"hi, admin",
                "userInfo":{"_id":"5f7b4af4300f0c2dc462de6d","tag":"@admin","firstName":"Sergey","lastName":"Andreev","isOnline":false}},
            {
                "_id":"5f7e0e9a7fc1d90f68d4509e",
                "senderTag":"@user",
                "receiverTag":"@siandreev",
                "date":"2020-10-07T18:55:06.830Z",
                "text":"hi siandreev from user",
                "userInfo":{"_id":"5f7df3f7abc9f526c0a57339","tag":"@user","firstName":"Ivan","lastName":"Ivanov","isOnline":true}},
            {
                "_id":"5f7de964b142be0494b3faf6",
                "senderTag":"@moderator",
                "receiverTag":"@siandreev",
                "date":"2020-10-07T16:14:28.142Z",
                "text":"hi siandreev from moderator",
                "userInfo":{"_id":"5f7b5d9f73da78315cfc3624","tag":"@moderator","firstName":"Sergey","lastName":"Andreev","isOnline":false}
            }
        ],"id":"1"}

--> {"jsonrpc": "2.0", "method": "getDialogsList", "params": [1], "id": "1"}
<-- {"jsonrpc":2,"result":
        [
            {
                "_id":"5f7e0e9a7fc1d90f68d4509e",
                "senderTag":"@user",
                "receiverTag":"@siandreev",
                "date":"2020-10-07T18:55:06.830Z",
                "text":"hi siandreev from user",
                "userInfo":{"_id":"5f7df3f7abc9f526c0a57339","tag":"@user","firstName":"Ivan","lastName":"Ivanov","isOnline":true}},
            {
                "_id":"5f7de964b142be0494b3faf6",
                "senderTag":"@moderator",
                "receiverTag":"@siandreev",
                "date":"2020-10-07T16:14:28.142Z",
                "text":"hi siandreev from moderator",
                "userInfo":{"_id":"5f7b5d9f73da78315cfc3624","tag":"@moderator","firstName":"Sergey","lastName":"Andreev","isOnline":false}
            }
        ],"id":"1"}

--> {"jsonrpc": "2.0", "method": "getMessagesWithUser", "params": ["@admin"], "id": "1"}
<-- {"jsonrpc":2,"result":
        [
            {
                "_id":"5f7f00e2bb456e0144a7f2db",
                "senderTag":"@siandreev",
                "receiverTag":"@admin",
                "text":"hi, admin",
                "date":"2020-10-08T12:06:58.447Z"
            },
            {
                "_id":"5f7df2a8abc9f526c0a57338",
                "senderTag":"@admin",
                "receiverTag":"@siandreev",
                "text":"fine, thx",
                "date":"2020-10-07T16:54:00.820Z"
            },
            {
                "_id":"5f7df289abc9f526c0a57337",
                "senderTag":"@siandreev",
                "receiverTag":"@admin",
                "text":"how r u?","date":"2020-10-07T16:53:29.318Z"
            },
            {
                "_id":"5f7de8fab142be0494b3faee",
                "senderTag":"@admin",
                "receiverTag":"@siandreev",
                "text":"hi siandreev",
                "date":"2020-10-07T16:12:42.772Z"},
            {
                "_id":"5f7de8c1b142be0494b3faed",
                "senderTag":"@siandreev",
                "receiverTag":"@admin",
                "text":"hi",
                "date":"2020-10-07T16:11:45.460Z"
            }
        ],"id":"1"}
```

#### Notifications
Notifications are received if a new message is received, a user from the contact list has logged out or logged in, or he has changed his personal data.

Notification format:
```
    {
        "type":<String>,
        "code":<Integer>,
        "body":<Object>
    }
``` 
The following types and codes are supported:

- code: ```3001```, type: ```newMessage```, meaning: a new message was received;
- code: ```3101```, type: ```contactOnline```, meaning: user logged in;
- code: ```3100```, type: ```contactOffline```, meaning: user logged out;
- code: ```3200```, type: ```contactPersonalDataChanges```, meaning: user has changed his personal data;

Examples of notifications:
```
<-- {"type":"contactOnline","code":3101,"body":{"loggedInUserTag":"@admin"}}
<-- {"type":"contactPersonalDataChanges","code":3200,"body":{"tag":"@admin","firstName":"Administrator"}}
<-- {"type":"newMessage","code":3001,"body":{"senderTag":"@admin","receiverTag":"@siandreev","text":"What a nice weather today isn't it?","date":1602160273082}}
<-- {"type":"contactOffline","code":3100,"body":{"loggedOutUserTag":"@admin"}}
```
