export interface Pagina { id: number; nombre: string; ruta: string; icono?: string | null; estado: boolean; }
export interface Rol { id: number; nombre: string; descripcion?: string | null; estado: boolean; }
export interface Persona { id:number; tipoDocumento:string; nroDocumento:string; nombres:string; apellidoPaterno:string; apellidoMaterno?:string|null; fechaNacimiento:string; correo?:string|null; telefono?:string|null; estado:boolean; }
export interface Usuario { id:number; nombreUsuario:string; estado:boolean; persona:Persona; rol:Rol; }
export interface AuthResponse { accessToken:string; tokenType:string; expiresIn:number; usuario:Usuario; paginas:Pagina[]; }
export interface PageResponse<T> { content:T[]; totalElements:number; totalPages:number; page:number; size:number; }
export interface PersonaPayload { tipoDocumento:string; nroDocumento:string; nombres:string; apellidoPaterno:string; apellidoMaterno:string|null; fechaNacimiento:string; correo:string|null; telefono:string|null; }
