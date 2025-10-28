import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaGeneralComponent } from './plantilla-general.component';

describe('PlantillaGeneralComponent', () => {
  let component: PlantillaGeneralComponent;
  let fixture: ComponentFixture<PlantillaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillaGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
