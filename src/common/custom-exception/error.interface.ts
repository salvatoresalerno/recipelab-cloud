export interface CustomErrorPayload {
  statusCode: number;
  message: string;
  error: string | any;
  code: string;
  details?: any;
}