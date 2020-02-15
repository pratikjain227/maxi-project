const Server = require("../models/server");

exports.getIndex2 = (req, res, next) => {
  Server.findServer()
    .then(allServers => {
      console.log(allServers);
      res("Success");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  console.log("Inside controllers.... >>>>>>");
  Server.findServer(allServers => {
    console.log("Inside controllers.... >>>>>>");
    console.log(allServers);
    res(allServers);
  });
};
