import "express-async-errors";
import "reflect-metadata";

import cors from "cors";
import http from "http";
import debug from "debug";
import helmet from "helmet";
import winston from "winston";
import express from "express";
import compression from "compression";
import expressWinston from "express-winston";
import rateLimit from "express-rate-limit";
import * as SocketIO from "socket.io";

import {
  AuthorizationMiddleware,
  BasicAuth,
  SetOriginKey,
} from "./middlewares/authorization.middleware";

import { IOServer } from "./services/Socket.Service";
import { ILoggedUser } from "./controller/authorization/authorization.controller";

declare global {
  namespace Express {
    interface Request {
      _LoggedUser: ILoggedUser;
      _key: string;
    }
  }
}

const notFoundHandler = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const message = "Resource not found";
  response.status(404).json({ status: 404, message });
};

const errorHandler = (
  error: HttpException,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const status = error.statusCode || error.status || 400;
  response.status(status).json({ status, ...error });
};

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

const limiter = rateLimit({
  windowMs: 1 * 1000, // 5 seundo
  max: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
class HttpException extends Error {
  statusCode?: number;
  status?: number;
  message: string;
  error: string | null;

  constructor(statusCode: number, message: string, error?: string) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.error = error || null;
  }
}

if (!process.env.DEBUG) loggerOptions.meta = false;
export default class Server {
  private app: express.Application;
  private server: http.Server;
  // private routes: Array<RoutesBase> = [];
  private debugLog: debug.IDebugger;
  private io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.debugLog = debug("app");
    this.app.set("trust proxy", 1);
    this.app.disable("x-powered-by");
    this.server = http.createServer(this.app);
    this.io = new SocketIO.Server(this.server, {
      allowRequest: (req, callback) => {
        // const noOriginHeader = req.headers.origin === undefined;
        callback(null, true);
      },
      transports: ["websocket", "polling"],
      cors: {
        origin: "http://localhost:3000", //Precisa disso para funcionar local
        // origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        // allowedHeaders: ["authorization"],
      },
    });
    IOServer(this.io);
    this.initializeMiddlewares();
    AuthorizationMiddleware(this.app);
    this.initializeErrorMiddlewares();
  }

  private initializeMiddlewares() {
    this.app.use(limiter);
    this.app.use(compression());
    this.app.use(expressWinston.logger(loggerOptions));
    this.app.use("/api-docs/swagger", express.static("swagger"));
    this.app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    this.app.use(express.json({ limit: "50mb", strict: false }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));

    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(SetOriginKey);
    this.app.use(BasicAuth);
  }

  private initializeErrorMiddlewares() {
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  public listen(port: number) {
    this.server.listen(port, () => {
      // this.routes.forEach((route: RoutesBase) => {
      //   this.debugLog(`Routes configured for ${route.getName()}`);
      // });
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
