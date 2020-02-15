const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const http = require("http");

const servers = [
  // {
  //   url: "http://doesNotExist.boldtech.co",
  //   priority: 1
  // },
  {
    url: "www.boldtech.co",
    priority: 7
  },
  // {
  //   url: "www.offline.boldtech.co",
  //   priority: 2
  // },
  {
    url: "www.google.com",
    priority: 4
  },
  {
    url: "www.vyasdental.com",
    priority: 10
  }
];

class Server {
  constructor(serverName, serverPriority) {
    this.serverName = serverName;
    this.serverPriority = serverPriority;
  }

  static findServer() {
    return new Promise((res, rej) => {
      res(servers);
    })
      .then(serversData => {
        return serversData.map(eachServer => ({
          host: eachServer.url,
          timeout: 5000,
          method: "GET"
        }));
      })
      .then(urlOptions => {
        return urlOptions.map(
          opt =>
            new Promise(function(res, rej) {
              console.log(opt);
              var req = http.request(opt, function(response) {
                console.log("Status Code = " + response.statusCode);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                  res(response.statusCode);
                } else {
                  rej("some message");
                }
              });
              req.on("error", function(err) {
                rej(err);
              });
              req.end();
            })
        );
      })
      .then(urlPromises => {
        console.log(urlPromises);
        return Promise.race(urlPromises)
          .then(resp => {
            console.log("Final Block");
            console.log(resp);
            return true;
          })
          .catch(err => {
            console.log("Error from Catch : " + err);
            return false;
          });
      })
      .then(isServerOnline => {
        console.log("isServerOnline : >>>>>>>> " + isServerOnline);
        if (!isServerOnline) {
          return rej("All servers are offline");
        } else {
          return servers.sort((a, b) =>
            a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0
          );
        }
      })
      .then(sortedServers => {
        console.log("Sorted Servers : >>> ");
        console.log(sortedServers);
        for (const eachServer of sortedServers) {
          new Promise(function(res, rej) {
            let eachServerOptions = {
              host: eachServer.url,
              timeout: 5000,
              method: "GET"
            };
            var req = http.request(eachServerOptions, function(response) {
              console.log("Status Code = " + response.statusCode);
              if (response.statusCode >= 200 && response.statusCode < 300) {
                console.log("Yay Moment.... !");
                return res(response.statusCode);
              }
            });
            req.on("error", function(err) {
              rej(err);
            });
            req.end();
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Server;
