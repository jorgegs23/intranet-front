import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidosDetailComponent } from './partidos-detail.component';

describe('PartidosDetailComponent', () => {
  let component: PartidosDetailComponent;
  let fixture: ComponentFixture<PartidosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartidosDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
