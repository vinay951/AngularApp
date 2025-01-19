import { TestBed } from '@angular/core/testing';

import { NotificationSendMessageService } from './notification-send-message.service';

describe('NotificationSendMessageService', () => {
  let service: NotificationSendMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSendMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
