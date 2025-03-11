import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../servicios/login/login.service';

export const usuarioGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
    const router = inject(Router);
    const esAdmin = loginService.getEsAdmin();
  
    if (esAdmin==='false') {
      //router.navigate(['/administrador']);
      return true;
    }
    router.navigate(['/login']);
    return false;
};