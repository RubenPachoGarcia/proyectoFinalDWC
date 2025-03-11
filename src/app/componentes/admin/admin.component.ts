import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminService, Usuario } from '../../servicios/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {  // Cambio aquí para que coincida con el @NgModule
  displayedColumns: string[] = ['idUsuario', 'nombreCompletoUsuario', 'correoUsuario', 'opcionUsuario'];
  dataSource = new MatTableDataSource<Usuario>([]);
  usuarios: Usuario[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data.filter(user => user.esAdmin === 'false');
      this.dataSource.data = this.usuarios;
    });
  }

  eliminarUsuario(idUsuario: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.adminService.eliminarUsuario(idUsuario).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.idUsuario !== idUsuario);
          this.dataSource.data = [...this.usuarios]; // Actualiza la tabla correctamente
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }  
}

@NgModule({
  declarations: [AdminComponent],  // Ahora coincide con la clase del componente
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    BrowserAnimationsModule
  ]
})
export class AdministradorModule {}
