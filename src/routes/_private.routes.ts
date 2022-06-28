import { AuthorizationPrivateRoutes } from "./Authorization.Private.routes";

export function PrivateRoutes(routes, app) {
    routes.push(new AuthorizationPrivateRoutes(app));
}
