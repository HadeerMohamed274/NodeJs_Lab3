const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

// Port and hostname
const port = 4000;
const hostname = "127.0.0.1";

// Import the home page content from home.js
const home = require("./home");

// Array to store the list of todos
let todos = [
  { id: 1, title: "Learn Node.js", status: "In Progress" },
  { id: 2, title: "Build a REST API", status: "Completed" },
];

// Function to generate the HTML table from the todos array
const generateTable = (todos) => {
  if (todos.length === 0) {
    return "<p>No todos yet. Add some tasks!</p>";
  }

  let tableRows = todos.map((todo) => `
    <tr>
      <td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>${todo.status}</td>
      
    </tr>
  `).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

// Create the server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  switch (req.method) {
    case "GET":
      switch (pathname) {
        case "/":
          // Serve home page with form and todos table
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.end(`
            <html>
              <head>
                <title>TODO List</title>
                <link rel="stylesheet" href="style.css">
              </head>
              <body>
                <h1>TODO List</h1>
                <h3>What Do You Want To Do Today?</h3>
                <form action="/todos" method="post">
                  <label for="title">Title</label>
                  <input type="text" name="title" required>
                  <label for="status">Status</label>
                  <input type="text" name="status" required>
                  <input type="submit" value="Add">
                </form>
                <h2>Current Todos</h2>
                ${generateTable(todos)}
              </body>
            </html>
          `);
          break;
        case "/todos":
          //  Todos as JSON
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(todos));
          break;
        case "/style.css":
          // CSS file
          fs.readFile("style.css", (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end("Internal Server Error");
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/css");
              res.end(data);
            }
          });
          break;
        default:
          if (pathname.startsWith("/todos/")) {
            const id = parseInt(pathname.split("/")[2], 10);
            const todo = todos.find((t) => t.id === id);

            if (todo) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.end(home(todo.title, todo.status));
            } else {
              res.statusCode = 404;
              res.setHeader("Content-Type", "text/plain");
              res.end("Todo Not Found");
            }
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end("NOT FOUND");
          }
      }
      break;
    case "POST":
      switch (pathname) {
        case "/todos":
          let body = [];

          req.on("data", (chunk) => {
            body.push(chunk);
          });

          req.on("end", () => {
            try {
              // Parse the URL-encoded data from the request
              body = Buffer.concat(body).toString();
              const formData = querystring.parse(body);
              const title = formData.title;
              const status = formData.status;

              if (!title || !status) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "text/plain");
                res.end("Title and status are required");
                return;
              }

              const newTodo = {
                id: todos.length + 1,
                title,
                status,
              };

              todos.push(newTodo);

              // Redirect back to the homepage
              res.writeHead(302, { Location: "/" });
              res.end();
            } catch (err) {
              console.error(err.message);
              res.statusCode = 400;
              res.setHeader("Content-Type", "text/plain");
              res.end("Invalid Data Format");
            }
          });
          break;
        default:
          // Not found
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("NOT FOUND");
      }
      break;
    default:
      res.statusCode = 405;
      res.setHeader("Content-Type", "text/plain");
      res.end("METHOD NOT ALLOWED");
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
