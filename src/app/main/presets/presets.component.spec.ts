import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetsComponent } from './presets.component';
import { PresetGroupComponent } from '../preset-group/preset-group.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PRESETS_MOCK } from '../preset/preset';
import { PresetComponent } from '../preset/preset.component';

describe('PresetsComponent', () => {
  let component: PresetsComponent;
  let fixture: ComponentFixture<PresetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PresetsComponent,
        PresetGroupComponent,
        PresetComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetsComponent);
    component = fixture.componentInstance;
    component.presets = PRESETS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
