import app from "./app";
import http from "http";
import { initSocket } from "./socket";

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const server = app.listen(port, () => {
  console.log(`server run successfuly on port ${port}!`);
});
