import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ItemsService, Item, CreateItemDto } from '../items/items.service';
import { BarterService, BarterRequest } from '../barter/barter.service';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Signals for reactive data
  availableItems = signal<Item[]>([]);
  myItems = signal<Item[]>([]);
  receivedRequests = signal<BarterRequest[]>([]);
  sentRequests = signal<BarterRequest[]>([]);
  currentUserId = signal<string | null>(null);

  // Form states
  showAddItemForm = false;
  searchQuery = '';
  newItem: CreateItemDto = {
    title: '',
    description: '',
    category: '',
    condition: 'good'
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private itemsService: ItemsService,
    private barterService: BarterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // If user is not authenticated, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user ID
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.currentUserId.set(currentUser.id);
    }

    // Load initial data
    this.loadAllItems();
    this.loadMyItems();
    this.loadBarterRequests();
  }

  // Items methods
  async loadAllItems(): Promise<void> {
    try {
      const items = await this.itemsService.getAllItems();
      this.availableItems.set(items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  async loadMyItems(): Promise<void> {
    try {
      const items = await this.itemsService.getMyItems();
      this.myItems.set(items);
    } catch (error) {
      console.error('Error loading my items:', error);
    }
  }

  async searchItems(): Promise<void> {
    if (this.searchQuery.trim()) {
      try {
        const items = await this.itemsService.searchItems(this.searchQuery);
        this.availableItems.set(items);
      } catch (error) {
        console.error('Error searching items:', error);
      }
    } else {
      this.loadAllItems();
    }
  }

  async addItem(): Promise<void> {
    if (!this.isNewItemValid()) return;

    try {
      await this.itemsService.createItem(this.newItem);
      this.resetNewItemForm();
      this.showAddItemForm = false;
      await this.loadMyItems();
      await this.loadAllItems(); // Refresh all items as well
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      await this.itemsService.deleteItem(itemId);
      await this.loadMyItems();
      await this.loadAllItems(); // Refresh all items as well
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  isNewItemValid(): boolean {
    return !!(this.newItem.title &&
              this.newItem.description &&
              this.newItem.category &&
              this.newItem.condition);
  }

  cancelAddItem(): void {
    this.resetNewItemForm();
    this.showAddItemForm = false;
  }

  private resetNewItemForm(): void {
    this.newItem = {
      title: '',
      description: '',
      category: '',
      condition: 'good'
    };
  }

  // Barter methods
  async loadBarterRequests(): Promise<void> {
    try {
      const received = await this.barterService.getReceivedRequests();
      const sent = await this.barterService.getSentRequests();

      this.receivedRequests.set(received);
      this.sentRequests.set(sent);
    } catch (error) {
      console.error('Error loading barter requests:', error);
    }
  }

  openBarterDialog(item: Item): void {
    const myAvailableItems = this.myItems().filter(myItem => myItem.isAvailable);

    if (myAvailableItems.length === 0) {
      alert('You need to add some items before making barter offers!');
      return;
    }

    // For now, we'll create a simple dialog. In a real app, you'd create a proper dialog component
    const offeredItemTitle = prompt(`Select one of your items to offer for "${item.title}":\n\n` +
      myAvailableItems.map((myItem, index) => `${index + 1}. ${myItem.title}`).join('\n') +
      '\n\nEnter the number of your choice:');

    if (offeredItemTitle) {
      const itemIndex = parseInt(offeredItemTitle) - 1;
      if (itemIndex >= 0 && itemIndex < myAvailableItems.length) {
        const offeredItem = myAvailableItems[itemIndex];
        const message = prompt('Add a message (optional):') || '';

        this.createBarterRequest(item.id, offeredItem.id, message);
      }
    }
  }

  async createBarterRequest(requestedItemId: string, offeredItemId: string, message: string): Promise<void> {
    try {
      await this.barterService.createBarterRequest({
        requestedItemId,
        offeredItemId,
        message
      });

      await this.loadBarterRequests();
      alert('Barter request sent successfully!');
    } catch (error) {
      console.error('Error creating barter request:', error);
      alert('Failed to send barter request. Please try again.');
    }
  }

  async updateRequestStatus(requestId: string, status: 'accepted' | 'rejected'): Promise<void> {
    try {
      await this.barterService.updateRequestStatus(requestId, status);
      await this.loadBarterRequests();

      const statusMessage = status === 'accepted' ? 'accepted' : 'rejected';
      alert(`Barter request ${statusMessage} successfully!`);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
