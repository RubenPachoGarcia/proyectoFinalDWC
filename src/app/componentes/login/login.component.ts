import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../servicios/login/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      correoUsuario: ['', [Validators.required, Validators.email]],
      contraseniaUsuario: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response); // Depuración

          if (response && response.esAdmin) { // Verificamos que response y response.role existen
            const esAdmin = response.esAdmin.trim(); 
            console.log('Rol del usuario:', esAdmin); // Depuración

            this.loginService.setEsAdmin(esAdmin);

            // Redirección según el rol
            if (esAdmin === 'true') {
              console.log('Redirigiendo a admin');
              this.router.navigate(['/admin']);
            } else if (esAdmin === 'false') {
              console.log('Redirigiendo a user');
              this.router.navigate(['/cuentas']);
            } else {
              console.log('Rol desconocido, redirigiendo a inicio');
              this.router.navigate(['/']);
            }
          } else {
            this.errorMessage = 'Error obteniendo el rol del usuario.';
          }
        },
        error: (err) => {
          console.error('Error en la autenticación:', err);
          this.errorMessage = err.error?.message || 'Error al iniciar sesión';
        }
      });
    }
  }
}
