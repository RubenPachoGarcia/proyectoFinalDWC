import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {

  private apiUrl = 'http://localhost:8080/api/recuperar';

  constructor(private http: HttpClient) {}

  recuperarContrasenia(correoUsuario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar`, { correoUsuario }, { observe: 'response' });
  }  

  cambiarContrasenia(token: string, contraseniaUsuario: string): Observable<any> {
    const body = { token, contraseniaUsuario: contraseniaUsuario };
    return this.http.post(`${this.apiUrl}/cambiar`, body);
  }
}