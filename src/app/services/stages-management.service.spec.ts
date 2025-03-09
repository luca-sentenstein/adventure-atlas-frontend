import { TestBed } from '@angular/core/testing';

import { StagesManagementService } from './stages-management.service';

describe('StagesManagementService', () => {
  let service: StagesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StagesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
