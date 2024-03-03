import { Server } from "socket.io";
interface Imsg {
  from: string;
  to: string;
  content: string;
}

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init socket service...");

    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public initListeners() {
    console.log("init socket listeners...");
    let users = {};
    const io = this.io;
    io.on("connect", (socket) => {
      console.log(`New Socket Connected : id: ${socket.id}`);
      const token = socket.handshake.query.userToken;
      //@ts-ignore
      users[token] = socket.id;
      console.log(users);

      socket.on("event:message", async (msg: Imsg) => {
        console.log(`New Message Recieved : ${msg}`);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
