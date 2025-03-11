import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecuperarService } from '../../servicios/recuperar/recuperar.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-recuperar-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrl: './recuperar-contrasenia.component.css'
})
export class RecuperarContraseniaComponent {
  recuperarForm: FormGroup;
  mensaje: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private recuperarservice: RecuperarService, private router: Router) {
    this.recuperarForm = this.fb.group({
      correoUsuario: ['', [Validators.required, Validators.email]]
    });
  }

  enviarCorreoUsuario() {
    if (this.recuperarForm.valid) {
      this.recuperarservice.recuperarContrasenia(this.recuperarForm.value.correoUsuario).subscribe({
        next: (response) => {
          this.mensaje = response.mensaje;
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Error al enviar el correo. Inténtalo de nuevo.';
        }
      });
    }
  }
}