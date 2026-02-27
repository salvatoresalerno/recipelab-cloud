export interface SyncChangeResponse {
  id: string; // Convertito da BigInt a string per JSON
  userId: string;
  entity: string;
  recordId: string;
  operation: string;
  payload: any;
  deviceId: string;
  createdAt: Date;
}