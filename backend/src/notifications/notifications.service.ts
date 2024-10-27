import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationsService {
  private filePath = path.join(__dirname, '../../notifications.json');

  private readNotifications(): any[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeNotifications(notifications: any[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(notifications, null, 2));
  }

  getNotifications(): any[] {
    return this.readNotifications();
  }

  addNotification(message: string): any {
    const notifications = this.readNotifications();
    const newNotification = { message, timestamp: new Date().toISOString() };
    notifications.push(newNotification);
    this.writeNotifications(notifications);
    return newNotification;
  }
}
