const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const http = require("http");

const serverData = [
  {
    url: "http://doesNotExist.boldtech.co",
    priority: 1
  },
  {
    url: "www.boldtech.co",
    priority: 7
  },
  {
    url: "www.offline.boldtech.co",
    priority: 2
  },
  {
    url: "www.google.com",
    priority: 4
  },
  {
    url: "www.vyasdental.com",
    priority: 2
  }
];

let promiseList = [];
serverData.map(eachServer => {
  promiseList.push(
    new Promise(function(res, rej) {
      let eachServerOptions = {
        host: eachServer.url,
        timeout: 5000,
        method: "GET"
      };
      console.log(eachServerOptions);
      var req = http.request(eachServerOptions, function(response) {
        console.log("Status Code = " + response.statusCode);
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res(eachServer);
        } else {
          rej(eachServer);
        }
      });
      req.on("error", function(err) {
        rej(eachServer);
      });
      req.end();
    })
  );
});

class Server {
  constructor(serverName, serverPriority) {
    this.serverName = serverName;
    this.serverPriority = serverPriority;
  }

  static findServer(res, req) {
    Promise.allSettled(promiseList)
      .then(serverStatus => {
        const onlineServers = serverStatus.filter(
          e => e.status === "fulfilled"
        );
        console.log(
          "onlineServers : >>>>>>>> length = " + onlineServers.length
        );
        console.log(onlineServers);
        if (onlineServers.length === 0) {
          return rej("All servers are offline");
        } else {
          return onlineServers;
        }
      })
      .then(onlineServers => {
        const sortedOnlineServers = onlineServers.sort((s1, s2) =>
          s1.value.priority > s2.value.priority
            ? 1
            : s2.value.priority > s1.value.priority
            ? -1
            : 0
        );
        console.log("sortedOnlineServers : >>>>>>>> ### ");
        console.log(sortedOnlineServers);
        console.log("Printing resolution");
        console.log(sortedOnlineServers[0].value.url);
        return res(sortedOnlineServers[0].value.url);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Server;
