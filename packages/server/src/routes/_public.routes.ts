import { AuthorizationPublicRoutes } from './Authorization.Public.routes';

export function PublicRoutes(routes, app) {
	routes.push(new AuthorizationPublicRoutes(app));
}
