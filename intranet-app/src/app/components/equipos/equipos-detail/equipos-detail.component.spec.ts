import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposDetailComponent } from './equipos-detail.component';

describe('EquiposDetailComponent', () => {
  let component: EquiposDetailComponent;
  let fixture: ComponentFixture<EquiposDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquiposDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
