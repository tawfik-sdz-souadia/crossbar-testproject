// Example WAMP client for AutobahnJS connecting to a Crossbar.io WAMP router.

// AutobahnJS, the WAMP client library to connect and talk to Crossbar.io:
var mysql = require('mysql'); 
var autobahn = require('autobahn');

var con = mysql.createConnection({
  host: "172.17.0.1",
  user: "root",
  password: "mysqlsdz158",
  database: "testdb"
});
 

console.log("Running AutobahnJS " + autobahn.version);

// We read the connection parameters from the command line in this example:
const url = process.env.CBURL;
const realm = process.env.CBREALM;

// Make us a new connection ..
var connection = new autobahn.Connection({url: url, realm: realm});
// .. and fire this code when we got a session
connection.onopen = function (session) {
   console.log("session open!");
   var counter = 0
   setInterval(function () {
      console.log("publishing to topic 'com.myapp.hello': " + "Hello World "+counter);
      session.publish('com.myapp.hello', ['Hello World ' + counter]);
      con.connect(function(err) {
        if (err) throw err;
          var name = "event N° "+counter;
          var sql = "INSERT INTO events (message,time) VALUES('"+name+"',CURTIME());"
          con.query(sql, function (err, result) {
          if (err) throw err; 
            console.log("Event has been added!");
          });
       });     
      counter += 1;
     }, 
   1000);
   connection.close();
};

// .. and fire this code when our session has gone
connection.onclose = function (reason, details) {
   console.log("session closed: " + reason, details);
}

// Don't forget to actually trigger the opening of the connection!
connection.open();
