import { Socket, io } from "socket.io-client";
import { ILoggedUser } from "../models/User.Model";

/*
 * Exemplo de uso
 *
 */

/*

  const { user } = useAuthorization();
  const [socketData, setSocketData] = React.useState<any>("teste");

  React.useEffect(() => {
    const s = StartSocket(user);
    s.on("ParlamentarUpdate", (data) => {
      setSocketData(data.data.pessoal.apelido);
    });
  }, []);


*/

export const StartSocket = (user: ILoggedUser): Socket => {
  return io(process.env.REACT_APP_API_SOCKET_URL, { //"http://127.0.0.1:4001"
    path: "/socket.io", 
    withCredentials: true,
    //   transports: ["websocket"],
    auth: {
      user,
    },
    extraHeaders: {
      authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
    },
    // reconnection: true,
    // reconnectionDelay: 1000,
    // reconnectionDelayMax : 5000,
    // reconnectionAttempts: 10,
  });
};
