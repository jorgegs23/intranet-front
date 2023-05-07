import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignacionesDetailComponent } from './designaciones-detail.component';

describe('DesignacionesDetailComponent', () => {
  let component: DesignacionesDetailComponent;
  let fixture: ComponentFixture<DesignacionesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignacionesDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignacionesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
