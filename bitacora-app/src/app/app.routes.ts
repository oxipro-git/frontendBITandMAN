import { Routes } from '@angular/router';
import { PlantillaGeneralComponent } from './components/plantilla-general/plantilla-general.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'plantilla-general',
    pathMatch: 'full'
  },
  {
    path: 'plantilla-general',
    component: PlantillaGeneralComponent
  }

];
