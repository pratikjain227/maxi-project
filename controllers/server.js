const request = require("http").request;

const REQUEST_TIMEOUT = 5000;
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
    new Promise(function(resolve, reject) {
      let eachServerOptions = {
        host: eachServer.url,
        timeout: REQUEST_TIMEOUT
      };
      var req = request(eachServerOptions, function(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(eachServer);
        } else {
          reject(eachServer);
        }
      });
      req.on("error", function(err) {
        reject(err);
      });
      req.end();
    }).catch(e => {})
  );
});

function findServer() {
  Promise.allSettled(promiseList)
    .then(serverStatus => {
      console.log("All Server Status :");
      console.log(serverStatus);
      const onlineServers = serverStatus.filter(e => e.value !== undefined);
      if (onlineServers.length === 0) {
        return Promise.reject("All servers are offline");
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
      console.log("Printing resolution");
      console.log(sortedOnlineServers[0].value.url);
      return Promise.resolve(sortedOnlineServers[0].value.url);
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = { findServer };
