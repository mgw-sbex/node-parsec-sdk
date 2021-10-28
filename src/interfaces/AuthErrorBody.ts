export interface AuthErrorBody {
  error: string;
  tfa_required?: boolean;
  tfa_type?: string;
}
