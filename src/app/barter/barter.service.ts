import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Item } from '../items/items.service';
import { environment } from '../../environments/environment';

export interface BarterRequest {
  id: string;
  requesterId: string;
  ownerId: string;
  requestedItemId: string;
  offeredItemId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  requester: {
    id: string;
    name: string;
    email: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  requestedItem: Item;
  offeredItem: Item;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBarterRequestDto {
  requestedItemId: string;
  offeredItemId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarterService {
  private apiUrl = environment.apiUrl;

  loading = signal(false);
  receivedRequests = signal<BarterRequest[]>([]);
  sentRequests = signal<BarterRequest[]>([]);

  constructor(private http: HttpClient) {}

  async createBarterRequest(request: CreateBarterRequestDto) {
    return await firstValueFrom(this.http.post<BarterRequest>(`${this.apiUrl}/barter`, request));
  }

  async getReceivedRequests() {
    this.loading.set(true);
    try {
      const requests = await firstValueFrom(this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/received`));
      this.loading.set(false);
      return requests || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async getSentRequests() {
    this.loading.set(true);
    try {
      const requests = await firstValueFrom(this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/sent`));
      this.loading.set(false);
      return requests || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async updateRequestStatus(id: string, status: 'accepted' | 'rejected'): Promise<BarterRequest> {
    return await firstValueFrom(this.http.put<BarterRequest>(`${this.apiUrl}/barter/${id}`, { status }));
  }

  loadReceivedRequests(){
    return this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/received`);
  }

  loadSentRequests() {
    return this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/sent`);
  }
}
