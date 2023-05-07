import { TestBed } from '@angular/core/testing';

import { DesignacionesService } from './designaciones.service';

describe('DesignacionesService', () => {
  let service: DesignacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
