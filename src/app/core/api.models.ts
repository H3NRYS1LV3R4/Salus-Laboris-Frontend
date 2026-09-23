export interface Pagina { id: number; nombre: string; ruta: string; icono?: string | null; estado: boolean; }
export interface Rol { id: number; nombre: string; descripcion?: string | null; estado: boolean; }
export interface Persona { id:number; tipoDocumento:string; nroDocumento:string; nombres:string; apellidoPaterno:string; apellidoMaterno?:string|null; fechaNacimiento:string; correo?:string|null; telefono?:string|null; estado:boolean; }
export interface Usuario { id:number; nombreUsuario:string; estado:boolean; persona:Persona; rol:Rol; fechaRegistro?:string; }
export interface AuthResponse { accessToken:string; tokenType:string; expiresIn:number; usuario:Usuario; paginas:Pagina[]; }
export interface LoginApiResponse {
  token?:string;
  accessToken?:string;
  tokenType:string;
  expiresInSeconds?:number;
  expiresIn?:number;
  usuario:Usuario;
  paginas:Pagina[];
}
export interface PageResponse<T> { content:T[]; totalElements:number; totalPages:number; page:number; size:number; }
export interface PersonaPayload { tipoDocumento:string; nroDocumento:string; nombres:string; apellidoPaterno:string; apellidoMaterno:string|null; fechaNacimiento:string; correo:string|null; telefono:string|null; }
export interface UsuarioCreatePayload { idPersona:number; idRol:number; nombreUsuario:string; password:string; }
export interface UsuarioUpdatePayload { idRol:number; nombreUsuario:string; }
export interface RolPayload { nombre:string; descripcion:string|null; }
export interface PaginaPayload { nombre:string; ruta:string; icono:string|null; }
