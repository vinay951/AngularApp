import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationSendMessageService {

  constructor() { }

  showNotification(message: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        console.log('Notification permission is granted. Notification will be shown.');
        // Show notification
        new Notification('New Message!', {
          body: message, // Custom body passed as an argument
          icon: 'compiler.png', // Ensure the icon is correct
          requireInteraction: true, // Keep the notification open until the user closes it
        });
      } else if (Notification.permission !== 'denied') {
        console.log('Notification permission is not granted yet. Requesting permission...');
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission is granted after request. Notification will be shown.');
            new Notification('New Message!', {
              body: message, // Custom body passed as an argument
              icon: 'compiler.png', // Ensure the icon is correct
              requireInteraction: true, // Keep the notification open until the user closes it
            });
          } else {
            console.log('Notification permission is denied. No notification will be shown.');
          }
        }).catch(err => {
          console.log('Error requesting notification permission:', err);
        });
      } else {
        console.log('Notification permission is denied. No notification will be shown.');
      }
    } else {
      console.log('Notifications are not supported by this browser.');
    }
  }
}
