export interface EmailRequest {
  toEmail: string;
  subject?: string;
  body: string;
}

export interface RequestOTP {
  email: string;
}
