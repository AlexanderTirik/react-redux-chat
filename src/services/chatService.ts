import makeRequest from "../helpers/makeRequest";
import { Method } from "../types/requestMethodType";
import IMessage from "../types/messageType";

class ChatService {
  async getMessages() {
    try {
      const apiUrl = "https://api.npoint.io/a139a0497ad54efd301f";
      const response = await makeRequest(Method.GET, apiUrl);
      const msg: IMessage[] = await response.json();
      const messages: IMessage[] = msg.map((message) => {
        message.likes = 0;
        message.idMessage = this.getIdMessage();
        message.formattedTime = this.formatTime(message.createdAt);
        return message;
      });
      messages.sort(this.compareMessages);

      return messages;
    } catch (error) {
      throw error;
    }
  }
  async loadChatData() {
    const messages = await this.getMessages();
    const participants = this.countParticipants(messages) + 1;
    return { messages, participants };
  }
  formatTime(date: string | Date) {
    const newDate = new Date(date);
    let minutes = newDate.getMinutes().toString();
    if (minutes.length === 1) minutes = "0" + minutes;
    return `${newDate.getHours()}:${minutes}`;
  }

  countParticipants(messages: IMessage[]) {
    const participants = new Set();
    messages.forEach((message: IMessage) => {
      participants.add(message.id);
    });
    return participants.size;
  }

  compareMessages(a: IMessage, b: IMessage) {
    if (new Date(a.createdAt) > new Date(b.createdAt)) return 1;
    if (new Date(a.createdAt) < new Date(b.createdAt)) return -1;
    return 0;
  }
  getIdMessage() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) 
    );
  }
}

export default new ChatService();
