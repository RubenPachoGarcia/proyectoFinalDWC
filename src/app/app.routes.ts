import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RecuperarContraseniaComponent } from './componentes/recuperar-contrasenia/recuperar-contrasenia.component';
import { CambiarContraseniaComponent } from './componentes/cambiar-contrasenia/cambiar-contrasenia.component';
import { loginGuard } from './guards/login/login.guard';
import { AdminComponent } from './componentes/admin/admin.component';

export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"registro",component:RegistroComponent},
    { path: 'admin', component: AdminComponent, canActivate: [loginGuard], data: { role: 'admin' } },
    { path: 'recuperar-contrasenia', component: RecuperarContraseniaComponent },
    { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];