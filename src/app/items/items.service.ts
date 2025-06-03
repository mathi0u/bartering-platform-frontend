import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000';

  loading = signal(false);
  items = signal<Item[]>([]);
  myItems = signal<Item[]>([]);

  constructor(private http: HttpClient) {}

  // Async methods for easier use in components
  async getAllItems(): Promise<Item[]> {
    this.loading.set(true);
    try {
      const items = await this.http.get<Item[]>(`${this.apiUrl}/items`).toPromise();
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async getMyItems(): Promise<Item[]> {
    this.loading.set(true);
    try {
      const items = await this.http.get<Item[]>(`${this.apiUrl}/items/my-items`).toPromise();
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  async createItem(item: CreateItemDto): Promise<Item> {
    return await this.http.post<Item>(`${this.apiUrl}/items`, item).toPromise() as Item;
  }

  async updateItem(id: string, item: Partial<CreateItemDto>): Promise<Item> {
    return await this.http.put<Item>(`${this.apiUrl}/items/${id}`, item).toPromise() as Item;
  }

  async deleteItem(id: string): Promise<{message: string}> {
    return await this.http.delete<{message: string}>(`${this.apiUrl}/items/${id}`).toPromise() as {message: string};
  }

  async searchItems(query: string): Promise<Item[]> {
    this.loading.set(true);
    try {
      const items = await this.http.get<Item[]>(`${this.apiUrl}/items?search=${encodeURIComponent(query)}`).toPromise();
      this.loading.set(false);
      return items || [];
    } catch (error) {
      this.loading.set(false);
      throw error;
    }
  }

  // Observable methods for reactive programming
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
