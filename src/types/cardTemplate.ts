
export interface CardTemplate {
  id: string;
  name: string;
  organizationId: string;
  backgroundColor: string;
  headerColor: string;
  textColor: string;
  qrCodePosition: 'bottom' | 'right';
  showLogo: boolean;
}
