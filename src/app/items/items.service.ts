import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  imageUrl?: string;
  isAvailable: boolean;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = environment.apiUrl;

  loading = signal(false);
  items = signal<Item[]>([]);
  myItems = signal<Item[]>([]);

  constructor(private http: HttpClient) {}

  async getAllItems() {
    this.loading.set(true);
    try {
      const items = await firstValueFrom(this.http.get<Item[]>(`${this.apiUrl}/items`));
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async getMyItems() {
    this.loading.set(true);
    try {
      const items = await firstValueFrom(this.http.get<Item[]>(`${this.apiUrl}/items/my-items`));
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async createItem(item: CreateItemDto) {
    return await firstValueFrom(this.http.post<Item>(`${this.apiUrl}/items`, item));
  }

  async updateItem(id: string, item: Partial<CreateItemDto>) {
    return await firstValueFrom(this.http.put<Item>(`${this.apiUrl}/items/${id}`, item));
  }

  async deleteItem(id: string) {
    return await firstValueFrom(this.http.delete<{message: string}>(`${this.apiUrl}/items/${id}`));
  }

  async searchItems(query: string) {
    this.loading.set(true);
    try {
      const items = await firstValueFrom(this.http.get<Item[]>(`${this.apiUrl}/items?search=${encodeURIComponent(query)}`));
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  loadItems(): Observable<Item[]> {
    this.loading.set(true);
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }

  loadMyItems(): Observable<Item[]> {
    this.loading.set(true);
    return this.http.get<Item[]>(`${this.apiUrl}/items/my-items`);
  }

  searchByCategory(category: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items?category=${encodeURIComponent(category)}`);
  }
}
