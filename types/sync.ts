
/**
 * Data Synchronization Types
 */

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  pendingChanges: number;
  error?: string;
}

export interface SyncableData {
  id: string;
  type: SyncDataType;
  data: any;
  timestamp: string;
  deviceId: string;
  synced: boolean;
  version: number;
}

export type SyncDataType = 
  | 'task'
  | 'reminder'
  | 'note'
  | 'meeting'
  | 'email'
  | 'preference'
  | 'integration'
  | 'behavior'
  | 'voice_profile';

export interface SyncConflict {
  id: string;
  type: SyncDataType;
  localData: any;
  remoteData: any;
  localTimestamp: string;
  remoteTimestamp: string;
  resolution?: 'local' | 'remote' | 'merge';
}

export interface SyncQueue {
  items: SyncableData[];
  processing: boolean;
  lastProcessed: string | null;
}

export interface DeviceSync {
  deviceId: string;
  lastSync: string;
  pendingItems: number;
  status: SyncStatus;
}
