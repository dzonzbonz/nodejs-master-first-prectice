/**
 * Primary File for the API
 */
// Environment
const env = require("./config");

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// unified server function
const unifiedServer = function(req, res) {
  console.log("Request: " + "\n", req.url);
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // get the path from the url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the HTTP headers
  const headersObject = req.headers;

  // Get HTTP Payload from Stream
  const decoder = new StringDecoder("UTF-8");
  let buffer = "";
  req.on("data", payload => {
    buffer += decoder.write(payload);
  });
  req.on("end", () => {
    buffer += decoder.end();
    // send the response
    console.log("Headers: " + "\n", headersObject);
    console.log("Payload: " + "\n", buffer);

    // choose the hadler this request will call
    // if one is not found use the not found handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // send data to the handler
    var data = {
      path: trimmedPath,
      query: queryStringObject,
      method: method,
      headers: headersObject,
      payload: buffer
    };

    // route the request to the handler
    chosenHandler(data, function(statusCode, payload) {
      // Default status code

      statusCode = typeof statusCode == "number" ? statusCode : 200;
      // Default payload
      payload = typeof payload == "object" ? payload : {};

      // convert response as string
      var payloadString = JSON.stringify(payload);

      // send the response to the caller

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log("Response: " + "\n", statusCode, payloadString);
    });
  });
};

// create a http server
const server = http.createServer(unifiedServer);

// listen to http
server.listen(env.port, () => {
  console.log(
    "HTTP Server:" +
      env.server +
      " is listening on http://localhost:" +
      env.port
  );
});

// define handlers
var handlers = {};

// sample handler
handlers.hello = function(data, callback) {
  callback(200, { name: "Hello World!" });
};

// sample handler
handlers.ping = function(data, callback) {
  callback(200);
};

// not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// routes
var router = {
  hello: handlers.hello,
  ping: handlers.ping
};
