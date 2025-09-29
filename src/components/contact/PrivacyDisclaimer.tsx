import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const PrivacyDisclaimer: React.FC = () => {
  return (
    <Alert className="mb-6 border-accent-primary/20 bg-card-dark/50">
      <Shield className="h-4 w-4 text-accent-primary" />
      <AlertDescription className="text-text-muted">
        <strong className="text-text-white">Privacy Notice:</strong> Your contact information will be securely processed and stored in Google Sheets via our n8n automation workflow. 
        We use this data solely to respond to your inquiry and will not share it with third parties. 
        By submitting this form, you consent to this data processing in accordance with our privacy policies.
      </AlertDescription>
    </Alert>
  );
};