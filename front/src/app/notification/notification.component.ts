import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';
import {TokenStorageService} from "../services/auth-services/token-storage.service";
import {NotificationService} from "../services/NotifService/notification.service";
import {Notifications} from "./model/Notifications";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  messages: Notifications[] = [];
  private messagesSubscription: any;

  constructor(private router:Router,private websocketService: WebSocketService,private tokenService:TokenStorageService,private notificationService:NotificationService) { }
  notificationTime:any;
  ngOnInit(): void {
    this.messagesSubscription = this.websocketService.initializeWebSocketConnection().subscribe(
      (message: string) => {
        let messageObject = message.split("/")// Log the received message
        let notification: Notifications = {
          id: parseInt(messageObject[0]),
          message: messageObject[1],
          isRead: false,
          time: this.getTimeDifference(new Date().getTime())

        };

          // Check if there is a message exist in messages
          let index = this.messages.findIndex(msg => msg.id === parseInt(messageObject[0]));
          if (index !== -1) {
            // If message found, remove it from messages
            this.messages.splice(index, 1);
          }
          // Add the message to the beginning of messages array


         this.messages.unshift(notification); // Update the messages array with the received message
      },
      (error) => {
        console.error("Error receiving message: ", error); // Handle any errors
      }

    );

    this.getUnreadNotification()
  }
  getTimeDifference(notificationTime:any): string {

      const currentTime = new Date();


      const differenceInMilliseconds = currentTime.getTime() - notificationTime ;
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const differenceInDays = Math.floor(differenceInHours / 24);

      if (differenceInDays > 0) {
        return `${differenceInDays}d`.toString();
      } else if (differenceInHours > 0) {
        return `${differenceInHours}h`.toString();
      } else if (differenceInMinutes > 0) {
        return `${differenceInMinutes}m`.toString();
      } else {
        return 'Maintenant';
      }
  }
  getUnreadNotification() {
    this.notificationService.getAllUnreadNotification(this.tokenService.getUser().sub).subscribe(
      (response: any) => {
        for (let i = 0; i < response.length; i++) {
          response[i].time = this.getTimeDifference(new Date(response[i].time).getTime());
          // Check if there is a message exist in messages
          let index = this.messages.findIndex(msg => msg.id === response[i].id);
          if (index !== -1) {
            // If message found, remove it from messages
            this.messages.splice(index, 1);
          }
          // Add the message to the beginning of messages array
          this.messages.unshift(response[i]);
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Ensure to unsubscribe from the observable to prevent memory leaks
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
  markAsRead(id:any){
    this.notificationService.markAsRead(id).subscribe(
      (response: any) => {
      }
    );
  }

  markItAsRead(id:any){
    this.markAsRead(id);
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1); // Remove the message from the array

    }

  }

  hide(){
    if (this.messages.length > 0) {
      return true;
    }
    return false;
  }

  viewAllNotifications() {
    // Navigate to the notifications page
    this.router.navigate(['/home/notfications']);

    // Toggle the visibility of the dropdown
    const dropdown = document.getElementById('dropdownNotification');
    if (dropdown) {
      dropdown.classList.add('hidden');
    } else {
      console.error('Dropdown element not found.');
    }
  }
}
