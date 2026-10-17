export type Permission = string;
export interface Principal { id: string; roles: string[]; permissions: Permission[]; }
export interface AuthorizationRequest { principal: Principal; action: string; resource: string; }
export interface SecurityPolicy { authorize(request: AuthorizationRequest): boolean; requiresApproval(action: string): boolean; }
export class DefaultSecurityPolicy implements SecurityPolicy { authorize(request: AuthorizationRequest): boolean { return request.principal.permissions.includes(request.action) || request.principal.permissions.includes('*'); } requiresApproval(action: string): boolean { return action.startsWith('execute:') || action.startsWith('network:'); } }
