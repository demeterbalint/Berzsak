import { TestBed } from '@angular/core/testing';

import { SidebarAnimationService } from './sidebar-animation.service';

describe('SidebarAnimationService', () => {
  let service: SidebarAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
