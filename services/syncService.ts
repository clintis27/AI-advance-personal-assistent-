
/**
 * Synchronization Service
 * Handles real-time data sync across all devices
 */

import { SecureStorage } from '@/utils/secureStorage';
import { authService } from './authService';
import {
  SyncState,
  SyncableData,
  SyncDataType,
  SyncConflict,
  SyncQueue,
  SyncStatus,
} from '@/types/sync';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export class SyncService {
  private static instance: SyncService;
  private syncState: SyncState = {
    status: 'idle',
    lastSync: null,
    pendingChanges: 0,
  };
  private syncQueue: SyncQueue = {
    items: [],
    processing: false,
    lastProcessed: null,
  };
  private isOnline: boolean = true;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Initialize sync service
   */
  private async initialize() {
    console.log('Initializing sync service...');
    
    // Load pending changes from storage
    await this.loadSyncQueue();
    
    // Monitor network connectivity
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      if (!wasOnline && this.isOnline) {
        console.log('Back online, syncing pending changes...');
        this.syncNow();
      }
    });

    // Start periodic sync (every 5 minutes)
    this.startPeriodicSync();
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && authService.isAuthenticated()) {
        this.syncNow();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Add data to sync queue
   */
  async addToQueue(type: SyncDataType, data: any): Promise<void> {
    const session = authService.getCurrentSession();
    
    if (!session) {
      console.warn('No active session, cannot add to sync queue');
      return;
    }

    const syncItem: SyncableData = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      deviceId: session.deviceId,
      synced: false,
      version: 1,
    };

    this.syncQueue.items.push(syncItem);
    this.syncState.pendingChanges = this.syncQueue.items.length;
    
    await this.saveSyncQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncNow();
    }
  }

  /**
   * Sync now
   */
  async syncNow(): Promise<void> {
    if (this.syncQueue.processing) {
      console.log('Sync already in progress');
      return;
    }

    if (!this.isOnline) {
      console.log('Offline, cannot sync');
      this.syncState.status = 'offline';
      return;
    }

    if (!authService.isAuthenticated()) {
      console.log('Not authenticated, cannot sync');
      return;
    }

    console.log('Starting sync...');
    this.syncQueue.processing = true;
    this.syncState.status = 'syncing';

    try {
      // Process each item in the queue
      for (const item of this.syncQueue.items) {
        if (!item.synced) {
          await this.syncItem(item);
        }
      }

      // Remove synced items
      this.syncQueue.items = this.syncQueue.items.filter(item => !item.synced);
      this.syncState.pendingChanges = this.syncQueue.items.length;
      this.syncState.lastSync = new Date().toISOString();
      this.syncState.status = 'success';
      this.syncQueue.lastProcessed = new Date().toISOString();

      await this.saveSyncQueue();
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync error:', error);
      this.syncState.status = 'error';
      this.syncState.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.syncQueue.processing = false;
    }
  }

  /**
   * Sync individual item
   */
  private async syncItem(item: SyncableData): Promise<void> {
    console.log('Syncing item:', item.id, item.type);
    
    try {
      const session = authService.getCurrentSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // In production, this would call your backend API
      // For now, we'll simulate the sync
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mark as synced
      item.synced = true;
      
      console.log('Item synced successfully:', item.id);
    } catch (error) {
      console.error('Error syncing item:', error);
      throw error;
    }
  }

  /**
   * Get sync state
   */
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * Get pending changes count
   */
  getPendingChangesCount(): number {
    return this.syncState.pendingChanges;
  }

  /**
   * Check if online
   */
  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Save sync queue to storage
   */
  private async saveSyncQueue(): Promise<void> {
    try {
      await SecureStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Load sync queue from storage
   */
  private async loadSyncQueue(): Promise<void> {
    try {
      const queueData = await SecureStorage.getItem('sync_queue');
      
      if (queueData) {
        this.syncQueue = JSON.parse(queueData);
        this.syncState.pendingChanges = this.syncQueue.items.length;
        
        console.log('Loaded sync queue:', this.syncQueue.items.length, 'items');
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  /**
   * Clear sync queue
   */
  async clearQueue(): Promise<void> {
    this.syncQueue.items = [];
    this.syncState.pendingChanges = 0;
    await this.saveSyncQueue();
  }

  /**
   * Handle sync conflicts
   */
  async resolveConflict(conflict: SyncConflict, resolution: 'local' | 'remote' | 'merge'): Promise<void> {
    console.log('Resolving conflict:', conflict.id, 'with', resolution);
    
    // In production, implement conflict resolution logic
    // For now, we'll just log it
  }
}

export const syncService = SyncService.getInstance();
