import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetComponent } from './preset.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { PRESET_MOCK } from './preset';

describe('PresetComponent', () => {
  let component: PresetComponent;
  let fixture: ComponentFixture<PresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresetComponent ],
      imports: [
        MatCardModule,
        MatDialogModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetComponent);
    component = fixture.componentInstance;
    component.preset = PRESET_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
