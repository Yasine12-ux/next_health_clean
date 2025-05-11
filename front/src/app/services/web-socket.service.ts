import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Message, Stomp } from '@stomp/stompjs';
import {Observable, Subject} from 'rxjs';
import {TokenStorageService} from "./auth-services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<string>(); // Create a new Subject to emit messages

  constructor(private tokenStorage:TokenStorageService) {}

  initializeWebSocketConnection(): Observable<string> {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function(frame: any) {
      that.openGlobalSocket(that.tokenStorage.getUser().sub); // Open a global socket for the current user
    });

    return this.messageSubject.asObservable(); // Return an observable that emits new messages
  }

  private openGlobalSocket(email: string): void {
    this.stompClient.subscribe(`/user/${(email)}/queue/notification`, (message: any)  => {
      if (message.body) {
        this.messageSubject.next(message.body); // Emit the message through the Subject
      }
    });
  }
}
