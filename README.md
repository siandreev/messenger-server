# messenger-server
Node js implementation of the server side for the messenger.

The server works according to the following scheme: if the client has a JWT (json web token) with authorization data, then he can connect via the web socket protocol along the path "/". To receive this token, the user must log in: send a post-request to "/login", for example:
```
fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        email: "email@example.com",
                        password: "password",
                    }
                })
            }).then(result => result.text()).then(mes => console.log(mes));
```
Or register: send post-request to "/signup":
```
fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        tag: "@tag",
                        firstName: "Name",
                        lastName: "Surname",
                        email: "email@example.com",
                        password: "password",
                    }
                })
            }).then(result => result.text()).then(mes => console.log(mes));
```

After that, you can connect using the websocket protocol, for example:
```
//create socket
const host =  "localhost:8000";
window.socket = new WebSocket(`ws://${host}/api`);

socket.onmessage = function(event) {
    console.log(`[message] Data from server: ${event.data}`);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed clearly, code=${event.code} cause=${event.reason}`);
    } else {
        console.log('[close] Connection interrupted');
    }
};

//send message
socket.send('{"jsonrpc": "2.0", "method": "getSelfInfo", "id": "1"}');
```

## Capabilities
- Creation and saving in the database users based on tag (starts with "@"), first name, last name, email, password (The password is hashed with argon2).
- Authorization and saving JWT in cookies.
- Connecting clients who received a JWT via websockets.
- Execution of methods for working with messages and dialogs via json-rpc 2.0 (for example sending a message, getting a contact list, etc.).
- Notifying online customers (that is, customers with an open web socket) about new messages, users logging into the network from the contact list and changing their personal data.

## Setting up and running
Download app using ```git clone https://github.com/siandreev/messenger-server.git```.
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
    "host": ""
  },
  "app": {
    "port": 8000
  },
  "client": {
    "url": "http://localhost:3000"
  }
}
```
Next, install the necessary modules using ```yarn install``` and start the server using ```yarn start```.

#### Demo
After starting the server in the console, you will see a link to the demo version of the client for testing the api. Follow the link and follow the instructions on the page.

## API
The server uses json-rpc 2.0 api (Batch requests are not supported yet). After you have authored (there was a cookie "auth" with a JWT), you can use the following methods:
```
getSelfInfo()
setSelfInfo(firstName, lastName)
sendMessageToUser(receiverTag, text)
getDialogsList(startIndex = 0, endIndex = 30)
getMessagesWithUser(receiverTag, startIndex = 0, endIndex = 100)
markMessagesWithUserAsRead(senderTag)
findUsersByTag(tag)
```

Requests examples:
```
--> {"jsonrpc": "2.0", "method": "getSelfInfo", "id": "1"}
<-- {"jsonrpc":2,"result":{"_id":"5f7b106bbed28f24c084c440","tag":"@siandreev","firstName":"Sergey","lastName":"Andreev","img":"5a3e87d927b652c3428c2c5bec133e08.png"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "setSelfInfo", "params":["", "Ivanov"], "id": "1"}
<-- {"jsonrpc":2,"result":{"_id":"5f7b106bbed28f24c084c440","tag":"@siandreev","firstName":"Sergey","lastName":"Ivanov"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "setSelfInfo", "params":["123", "Ivanov"], "id": "1"}
<-- {"jsonrpc":2,"error":{"code":-32602,"message":"Invalid params"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "sendMessageToUser", "params": ["@admin", "hi, admin"], "id": "1"}
<-- {"jsonrpc":2,"result":{"status":"OK","message":{"senderTag":"@siandreev","receiverTag":"@admin","text":"hi, admin","date":1602158818458}},"id":"1"}

--> {"jsonrpc": "2.0", "method": "markMessagesWithUserAsRead", "params": ["@admin"], "id": "1"}
<-- {"jsonrpc":2,"result":{"status":"OK"},"id":"1"}

--> {"jsonrpc": "2.0", "method": "findUsersByTag", "params": ["@s"], "id": "1"}
<-- {"jsonrpc":2,"result":[
        {
            "_id":"5f7eee91c7a2691af0774a87",
            "tag":"@first",
            "firstName":"First",
            "lastName":"First",
            "img":"default.jpg","isOnline":false
        },
        {
            "_id":"5f7df3f7abc9f526c0a57339",
            "tag":"@ostrenkota",
            "firstName":"Taya",
            "lastName":"Ostrenko",
            "img":"4bad835bcf4d487c9e281bc160f76214.jpg",
            "isOnline":false
        },
        {
            "_id":"5f7eef73c7a2691af0774a8a",
            "tag":"@second",
            "firstName":"Second",
            "lastName":"Second",
            "img":"default.jpg",
            "isOnline":false
        },
        {
            "_id":"5f7b106bbed28f24c084c440",
            "tag":"@siandreev",
            "firstName":"Sergey",
            "lastName":"Ivanov",
            "img":"default.jpg","isOnline":true
        }
    ],"id":"1"}

--> {"jsonrpc": "2.0", "method": "findUsersByTag", "params": ["SIa"], "id": "1"}
<-- {"jsonrpc":2,"result":[
        {
            "_id":"5f7b106bbed28f24c084c440",
            "tag":"@siandreev",
            "firstName":"Sergey",
            "lastName":"Ivanov",
            "img":"default.jpg",
            "isOnline":true
        }
    ],"id":"1"}

--> {"jsonrpc": "2.0", "method": "getDialogsList", "id": "1"}
<-- {"jsonrpc": 2,
      "result": [
        {
          "_id": "5f96a492dd5440127c12b414",
          "senderTag": "@siandreev",
          "receiverTag": "@test",
          "date": "2020-10-26T13:05:37.971Z",
          "text": "!",
          "unreadCount": 0,
          "userInfo": {
            "_id": "5f96a44bdd5440127c12b413",
            "tag": "@test",
            "firstName": "Test",
            "lastName": "Test",
            "img": "3f62cf13043c9f7fc2f2d42b0b89f606.jpg",
            "isOnline": false
          }
        },
        {
          "_id": "5f95bd6b922a3416d0c30237",
          "senderTag": "@siandreev",
          "receiverTag": "@ostrenkotai",
          "date": "2020-10-26T13:00:53.430Z",
          "text": "😍",
          "unreadCount": 1,
          "userInfo": {
            "_id": "5f95bd40922a3416d0c30236",
            "tag": "@ostrenkotai",
            "firstName": "Taisia",
            "lastName": "Ostrenko",
            "img": "9ecaa2409902345f0b7fee1b6f7ae05d.jpg",
            "isOnline": false
          }
        },
        {
          "_id": "5f7de964b142be0494b3faf6",
          "senderTag": "@moderator",
          "receiverTag": "@siandreev",
          "date": "2020-10-25T20:45:04.590Z",
          "text": "Как дела?",
          "unreadCount": 0,
          "userInfo": {
            "_id": "5f7b5d9f73da78315cfc3624",
            "tag": "@moderator",
            "firstName": "Sergey",
            "lastName": "Mobile",
            "img": "22ced17270827386bc5577baf3def745.jpg",
            "isOnline": false
          }
        },
        {
          "_id": "5f7e0e9a7fc1d90f68d4509e",
          "senderTag": "@ostrenkota",
          "receiverTag": "@siandreev",
          "date": "2020-10-25T17:42:26.097Z",
          "text": "hi",
          "unreadCount": 0,
          "userInfo": {
            "_id": "5f7df3f7abc9f526c0a57339",
            "tag": "@ostrenkota",
            "firstName": "Taya",
            "lastName": "Ostrenko",
            "img": "63dd709a8e83ec2b2106b2a8bcc79d19.png",
            "isOnline": false
          }
        }
      ],"id":"1"}


--> {"jsonrpc": "2.0", "method": "getMessagesWithUser", "params": ["@test"], "id": "1"}
<-- {
      "jsonrpc": 2,
      "result": [
        {
          "_id": "5f96c9a1251b99104cd693e5",
          "senderTag": "@siandreev",
          "receiverTag": "@test",
          "text": "!",
          "date": "2020-10-26T13:05:37.971Z",
          "isRead": true
        },
        {
          "_id": "5f96c980251b99104cd693e4",
          "senderTag": "@test",
          "receiverTag": "@siandreev",
          "text": "😋",
          "date": "2020-10-26T13:05:04.708Z",
          "isRead": true
        },
        {
          "_id": "5f96c85c251b99104cd693e2",
          "senderTag": "@test",
          "receiverTag": "@siandreev",
          "text": "Qw",
          "date": "2020-10-26T13:00:12.881Z",
          "isRead": true
        },
        {
          "_id": "5f96c85c251b99104cd693e1",
          "senderTag": "@test",
          "receiverTag": "@siandreev",
          "text": "Qw",
          "date": "2020-10-26T13:00:12.740Z",
          "isRead": true
        },
        {
          "_id": "5f96c838251b99104cd693e0",
          "senderTag": "@siandreev",
          "receiverTag": "@test",
          "text": "1",
          "date": "2020-10-26T12:59:36.754Z",
          "isRead": true
        }
      ],"id":"1"}
```

## Notifications
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
- code: ```3300```, type: ```messageWasRead```, notifies that the user has read your messages;

Examples of notifications:
```
<-- {"type":"contactOnline","code":3101,"body":{"loggedInUserTag":"@admin"}}
<-- {"type":"contactPersonalDataChanges","code":3200,"body":{"tag":"@admin","firstName":"Administrator", "img":"1cd301394749c914408e2d959eebf431.png"}}
<-- {"type":"newMessage","code":3001,"body":{"senderTag":"@admin","receiverTag":"@siandreev","text":"What a nice weather today isn't it?","date":1602160273082}}
<-- {"type":"contactOffline","code":3100,"body":{"loggedOutUserTag":"@admin"}}
<-- {"type":"messageWasRead","code":3300,"body":{"receiverTag":"@admin"}}
```
