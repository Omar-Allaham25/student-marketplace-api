import app from "./app";
import http from "http";
import { initSocket } from "./socket";

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const server = httpServer.listen(port, () => {
  console.log(`server run successfuly on port ${port}!`);
});
