import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/login/usuario';

  // BehaviorSubjects para el estado reactivo del usuario
  private userSubject = new BehaviorSubject<{ esAdmin: string | null; correoUsuario: string | null }>({
    esAdmin: this.getEsAdmin(),
    correoUsuario: this.getCorreoUsuario()
  });

  user$ = this.userSubject.asObservable(); // Exponemos el observable

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  login(credentials: { correoUsuario: string; contraseniaUsuario: string }): Observable<{ esAdmin: string; correoUsuario: string }> {
    return this.http.post(this.apiUrl, credentials, { responseType: 'text' }) // Especificamos 'text'
      .pipe(
        map(response => {
          const esAdmin = response;
          const correoUsuario = credentials.correoUsuario;
          this.setEsAdmin(esAdmin);
          this.setCorreoUsuario(correoUsuario);

          // Emitimos los nuevos valores al observable
          this.userSubject.next({ esAdmin: esAdmin, correoUsuario: correoUsuario });

          return { esAdmin: esAdmin, correoUsuario: correoUsuario };
        })
      );
  }

  setEsAdmin(esAdmin: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('esAdmin', esAdmin);
      this.userSubject.next({ esAdmin, correoUsuario: this.getCorreoUsuario() }); // Emitimos cambios
    }
  }

  getEsAdmin(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('esAdmin');
    }
    return null;
  }

  setCorreoUsuario(correoUsuario: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('correoUsuario', correoUsuario);
      this.userSubject.next({ esAdmin: this.getEsAdmin(), correoUsuario }); // Emitimos cambios
    }
  }

  getCorreoUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('correoUsuario');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('esAdmin');
      localStorage.removeItem('correoUsuario');
      this.userSubject.next({ esAdmin: null, correoUsuario: null }); // Emitimos cambios
    }
  }
}