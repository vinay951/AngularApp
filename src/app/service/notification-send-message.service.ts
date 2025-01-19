import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationSendMessageService {

  constructor() { }

  showNotification(message: string) {
    if (Notification.permission === 'granted') {
      // Only show notification if permission is granted
      new Notification('New Message!', {
        body: message, // Custom body passed as an argument
        icon: 'assets/notification-icon.png', // Optional icon
      });
    } else {
      // If permission is not granted, don't show the notification
      console.log('Notification permission is not granted. No notification will be shown.');
    }
  }
}
