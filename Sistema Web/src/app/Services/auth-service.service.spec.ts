import { TestBed } from '@angular/core/testing';

import { AuthServiceService } from './auth-service.service';



describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceService);
  });


});
