import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:8099/api/registro/usuario';  // Endpoint correcto

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, usuario);
  }  
}  