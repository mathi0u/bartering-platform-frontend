import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../items/items.service';

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
  private apiUrl = 'http://localhost:3000';

  loading = signal(false);
  receivedRequests = signal<BarterRequest[]>([]);
  sentRequests = signal<BarterRequest[]>([]);

  constructor(private http: HttpClient) {}

  // Async methods for easier use in components
  async createBarterRequest(request: CreateBarterRequestDto): Promise<BarterRequest> {
    return await this.http.post<BarterRequest>(`${this.apiUrl}/barter`, request).toPromise() as BarterRequest;
  }

  async getReceivedRequests(): Promise<BarterRequest[]> {
    this.loading.set(true);
    try {
      const requests = await this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/received`).toPromise();
      this.loading.set(false);
      return requests || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async getSentRequests(): Promise<BarterRequest[]> {
    this.loading.set(true);
    try {
      const requests = await this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/sent`).toPromise();
      this.loading.set(false);
      return requests || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async updateRequestStatus(id: string, status: 'accepted' | 'rejected'): Promise<BarterRequest> {
    return await this.http.put<BarterRequest>(`${this.apiUrl}/barter/${id}`, { status }).toPromise() as BarterRequest;
  }

  // Observable methods for reactive programming
  loadReceivedRequests(): Observable<BarterRequest[]> {
    return this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/received`);
  }

  loadSentRequests(): Observable<BarterRequest[]> {
    return this.http.get<BarterRequest[]>(`${this.apiUrl}/barter/sent`);
  }
}
