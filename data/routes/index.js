import { africa } from './africa-001.js';
export const ROUTES=[africa];
export const routeById=Object.fromEntries(ROUTES.map(r=>[r.id,r]));
