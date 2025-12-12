import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SeafarerService } from './seafarer';

describe('SeafarerService', () => {
  let service: SeafarerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SeafarerService]
    });
    service = TestBed.inject(SeafarerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});