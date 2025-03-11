import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperarService } from '../../servicios/recuperar/recuperar.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'] 
})
export class CambiarContraseniaComponent implements OnInit {
  cambiarForm!: FormGroup;
  token: string = '';
  mensaje: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recuperarService: RecuperarService 
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.cambiarForm = this.fb.group({
      contrasenia: ['', [Validators.required]],
      confirmarContrasenia: ['', [Validators.required]]
    }, { validators: this.contraseniaCoinciden });
  }

  contraseniaCoinciden(group: FormGroup) {
    const contrasenia = group.get('contrasenia');
    const confirmarContrasenia = group.get('confirmarContrasenia');

    if (!contrasenia || !confirmarContrasenia) return null;

    if (contrasenia.value !== confirmarContrasenia.value) {
      confirmarContrasenia.setErrors({ notMatching: true });
      return { notMatching: true };
    } else {
      confirmarContrasenia.setErrors(null);
      return null;
    }
  }

  cambiarContrasenia() {
    if (this.cambiarForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    if (this.cambiarForm.get('confirmarContrasenia')?.hasError('notMatching')) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const contrasenia = this.cambiarForm.value.contrasenia;

    this.recuperarService.cambiarContrasenia(this.token, contrasenia).subscribe({ // Corregido "contraseniaService"
      next: (response) => {
        this.mensaje = response.mensaje;
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Hubo un error al cambiar la contraseña.';
      }
    });
  }
}
