import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { PlantillaGeneralComponent } from './app/components/plantilla-general/plantilla-general.component';

bootstrapApplication(PlantillaGeneralComponent, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));
