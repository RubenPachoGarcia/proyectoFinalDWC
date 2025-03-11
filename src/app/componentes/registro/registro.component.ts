import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService } from '../../servicios/registro/registro.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensajeError: string = '';
  fotoSeleccionada: File | null = null;

  constructor(private fb: FormBuilder, private registroService: RegistroService, private router: Router) { 
    this.registroForm = this.fb.group({
      nombreCompletoUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]], // Se agregó validación de email
      telefonoUsuario: ['', Validators.required],
      contraseniaUsuario: ['', Validators.required],
      confirmarContraseniaUsuario: ['', Validators.required],
      esAdmin: ['false'],
      confirmado: [false]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoSeleccionada = input.files[0];
    }
  }

  validarYEnviar() {
    if (this.registroForm.invalid) {
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    const contraseniaUsuario = this.registroForm.get('contraseniaUsuario')?.value;
    const confirmarContraseniaUsuario = this.registroForm.get('confirmarContraseniaUsuario')?.value;

    if (contraseniaUsuario !== confirmarContraseniaUsuario) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    const formData = new FormData();
    formData.append('nombreCompletoUsuario', this.registroForm.get('nombreCompletoUsuario')?.value);
    formData.append('correoUsuario', this.registroForm.get('correoUsuario')?.value);
    formData.append('telefonoUsuario', this.registroForm.get('telefonoUsuario')?.value);
    formData.append('contraseniaUsuario', this.registroForm.get('contraseniaUsuario')?.value);
    formData.append('esAdmin', 'false');
    formData.append('confirmado', 'false');

    if (this.fotoSeleccionada) {
      formData.append('fotoUsuario', this.fotoSeleccionada);
    }

    this.registroService.registrarUsuario(formData).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.mensajeError = 'Error en el registro: ' + (error.error?.message || 'Inténtalo nuevamente.');
      }
    });
  }
}
