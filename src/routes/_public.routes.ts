import { AuthorizationPublicRoutes } from "./Authorization.Public.routes";

export function PublicRoutes(routes, app) {
  console.log('subindo ');
    routes.push(new AuthorizationPublicRoutes(app));
}