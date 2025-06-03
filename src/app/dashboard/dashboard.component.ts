import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ItemsService, Item, CreateItemDto } from '../items/items.service';
import { BarterService, BarterRequest } from '../barter/barter.service';
import { FormsModule } from '@angular/forms';

// Angular Material imports
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
  template: `
    <mat-toolbar color="primary" class="dashboard-toolbar">
      <span class="toolbar-title">
        <mat-icon>dashboard</mat-icon>
        Bartering App
      </span>
      <span class="spacer"></span>
      <button mat-raised-button color="accent" (click)="logout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <mat-tab-group class="dashboard-tabs">

        <!-- Browse Items Tab -->
        <mat-tab label="Browse Items">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search items</mat-label>
                <input matInput [(ngModel)]="searchQuery" (keyup.enter)="searchItems()" placeholder="Enter keywords...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="searchItems()">Search</button>
              <button mat-button (click)="loadAllItems()">Show All</button>
            </div>

            <div class="items-grid">
              @for (item of availableItems(); track item.id) {
                <mat-card class="item-card">
                  <mat-card-header>
                    <mat-card-title>{{ item.title }}</mat-card-title>
                    <mat-card-subtitle>{{ item.category }} - {{ item.condition }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ item.description }}</p>
                    <p class="owner-info">Owner: {{ item.owner.name }}</p>
                  </mat-card-content>
                  <mat-card-actions>
                    @if (item.ownerId !== currentUserId()) {
                      <button mat-raised-button color="primary" (click)="openBarterDialog(item)">
                        Make Offer
                      </button>
                    }
                  </mat-card-actions>
                </mat-card>
              } @empty {
                <div class="empty-state">
                  <mat-icon>inbox</mat-icon>
                  <p>No items available for trading</p>
                </div>
              }
            </div>
          </div>
        </mat-tab>

        <!-- My Items Tab -->
        <mat-tab label="My Items">
          <div class="tab-content">
            <div class="add-item-section">
              <button mat-raised-button color="primary" (click)="showAddItemForm = !showAddItemForm">
                <mat-icon>add</mat-icon>
                Add New Item
              </button>
            </div>

            @if (showAddItemForm) {
              <mat-card class="add-item-card">
                <mat-card-header>
                  <mat-card-title>Add New Item</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Title</mat-label>
                      <input matInput [(ngModel)]="newItem.title" required>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Category</mat-label>
                      <input matInput [(ngModel)]="newItem.category" required>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Condition</mat-label>
                      <mat-select [(ngModel)]="newItem.condition" required>
                        <mat-option value="new">New</mat-option>
                        <mat-option value="like-new">Like New</mat-option>
                        <mat-option value="good">Good</mat-option>
                        <mat-option value="fair">Fair</mat-option>
                        <mat-option value="poor">Poor</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput [(ngModel)]="newItem.description" rows="3" required></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="addItem()" [disabled]="!isNewItemValid()">
                    Add Item
                  </button>
                  <button mat-button (click)="cancelAddItem()">Cancel</button>
                </mat-card-actions>
              </mat-card>
            }

            <div class="items-grid">
              @for (item of myItems(); track item.id) {
                <mat-card class="item-card">
                  <mat-card-header>
                    <mat-card-title>{{ item.title }}</mat-card-title>
                    <mat-card-subtitle>{{ item.category }} - {{ item.condition }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ item.description }}</p>
                    <p class="status" [class.available]="item.isAvailable" [class.unavailable]="!item.isAvailable">
                      {{ item.isAvailable ? 'Available' : 'Not Available' }}
                    </p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="warn" (click)="deleteItem(item.id)">
                      <mat-icon>delete</mat-icon>
                      Delete
                    </button>
                  </mat-card-actions>
                </mat-card>
              } @empty {
                <div class="empty-state">
                  <mat-icon>inventory</mat-icon>
                  <p>You haven't added any items yet</p>
                </div>
              }
            </div>
          </div>
        </mat-tab>

        <!-- Barter Requests Tab -->
        <mat-tab label="Barter Requests">
          <div class="tab-content">
            <mat-tab-group>
              <mat-tab label="Received">
                <div class="requests-list">
                  @for (request of receivedRequests(); track request.id) {
                    <mat-card class="request-card">
                      <mat-card-header>
                        <mat-card-title>{{ request.requester.name }} wants your {{ request.requestedItem.title }}</mat-card-title>
                        <mat-card-subtitle>Status: {{ request.status }}</mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <p><strong>Offering:</strong> {{ request.offeredItem.title }}</p>
                        <p><strong>Message:</strong> {{ request.message }}</p>
                      </mat-card-content>
                      @if (request.status === 'pending') {
                        <mat-card-actions>
                          <button mat-raised-button color="primary" (click)="updateRequestStatus(request.id, 'accepted')">
                            Accept
                          </button>
                          <button mat-button color="warn" (click)="updateRequestStatus(request.id, 'rejected')">
                            Reject
                          </button>
                        </mat-card-actions>
                      }
                    </mat-card>
                  } @empty {
                    <div class="empty-state">
                      <mat-icon>inbox</mat-icon>
                      <p>No requests received</p>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab label="Sent">
                <div class="requests-list">
                  @for (request of sentRequests(); track request.id) {
                    <mat-card class="request-card">
                      <mat-card-header>
                        <mat-card-title>Request for {{ request.requestedItem.title }}</mat-card-title>
                        <mat-card-subtitle>Status: {{ request.status }}</mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <p><strong>Your offer:</strong> {{ request.offeredItem.title }}</p>
                        <p><strong>Message:</strong> {{ request.message }}</p>
                      </mat-card-content>
                    </mat-card>
                  } @empty {
                    <div class="empty-state">
                      <mat-icon>send</mat-icon>
                      <p>No requests sent</p>
                    </div>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toolbar-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: calc(100vh - 64px);
      min-height: calc(-webkit-fill-available - 64px);
      overflow-y: auto;
      box-sizing: border-box;
    }

    .dashboard-content {
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }

    .user-info-card {
      height: fit-content;
    }

    .user-info-card mat-card-header {
      margin-bottom: 16px;
    }

    .user-info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .detail-item mat-icon {
      color: #6c757d;
    }

    .detail-item div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item strong {
      font-size: 12px;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span {
      font-size: 16px;
      color: #333;
    }

    .welcome-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .welcome-card mat-card-header mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .welcome-content {
      text-align: center;
    }

    .welcome-content h3 {
      margin: 0 0 16px 0;
      font-size: 28px;
    }

    .welcome-content p {
      margin: 8px 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .tech-list {
      list-style: none;
      padding: 0;
      margin: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tech-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      padding: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      font-weight: 500;
    }

    .tech-list mat-icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .dashboard-container {
        padding: 16px;
        min-height: calc(100vh - 56px);
        min-height: calc(-webkit-fill-available - 56px);
      }

      .toolbar-title {
        font-size: 18px;
      }
    }

    @media (max-width: 480px) {
      .dashboard-container {
        padding: 12px;
      }

      .dashboard-content {
        gap: 12px;
      }
    }

    @media (max-height: 600px) {
      .dashboard-container {
        padding: 16px;
        min-height: auto;
      }
    }

    /* Tabs specific styles */
    .dashboard-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
    }

    /* Search bar styles */
    .search-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    /* Items grid styles */
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .item-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .owner-info {
      color: #666;
      font-size: 0.9em;
      margin-top: 8px;
    }

    .status {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
    }

    .status.available {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status.unavailable {
      background-color: #ffebee;
      color: #c62828;
    }

    /* Add item form styles */
    .add-item-section {
      margin-bottom: 24px;
    }

    .add-item-card {
      margin-bottom: 24px;
      border: 2px dashed #ddd;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-grid .full-width {
      grid-column: 1 / -1;
    }

    /* Requests styles */
    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .request-card {
      border-left: 4px solid #2196f3;
    }

    .request-card[data-status="accepted"] {
      border-left-color: #4caf50;
    }

    .request-card[data-status="rejected"] {
      border-left-color: #f44336;
    }

    /* Empty state styles */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      font-size: 1.1em;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .search-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: unset;
      }

      .items-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .tab-content {
        padding: 16px;
      }
    }
  `]
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
