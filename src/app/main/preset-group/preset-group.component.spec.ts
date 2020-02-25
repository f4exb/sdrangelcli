import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetGroupComponent } from './preset-group.component';
import { PresetComponent } from '../preset/preset.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PRESET_GROUP_MOCK } from '../preset/preset';

describe('PresetGroupComponent', () => {
  let component: PresetGroupComponent;
  let fixture: ComponentFixture<PresetGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PresetGroupComponent,
        PresetComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetGroupComponent);
    component = fixture.componentInstance;
    component.presetGroup = PRESET_GROUP_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
