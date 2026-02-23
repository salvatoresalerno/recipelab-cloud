import { HttpStatus } from "@nestjs/common";

export class ApiResponseDto<T = any> {
     
  success: boolean;

  statusCode: number;

  message: string | string[] | null;  
  
  error: string | null;
  
  code: string;  
  
  data: T | null;

}


export class ErrorApiResponseDto extends ApiResponseDto<null> {
    
  declare success: false;  
  
  declare data: null;
}

export class SuccessApiResponseDto<T> extends ApiResponseDto<T> {
  declare success: true;

  declare error: null;
}

export class ResponseCSRFtoken {
  csrfToken: string;
}

/* export class ResponseUserDto {  rimosso temporaneamente, non ancora utilizzato
  id: string;

  username: string;

  email: string; 

  password?: string;
  emailVerified?: boolean;
  
  isActive?: boolean;
  isLocked?: boolean;
  lockedExpire?: Date | null; 
  failedLoginAttempts?: number;

  isAdminBlocked?: boolean;
  blockedAt?: Date | null;
  blockedUntil?: Date | null;    
  blockedReason?: string | null;
  blockedBy?: string | null;     

  lastLogin?: Date | null;
  createdAt?: Date;

  refreshToken?: string;            
  refreshTokenExpireAt?: Date;

  instanceId?: string 

} */

