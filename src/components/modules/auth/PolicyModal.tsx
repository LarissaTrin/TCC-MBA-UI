"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { GenericButton } from "@/components/widgets";
import { ButtonVariant } from "@/common/enum";

interface PolicyModalProps {
  type: "terms" | "privacy";
  open: boolean;
  onClose: () => void;
}

const TERMS_CONTENT = (
  <>
    <Typography variant="h6" gutterBottom>1. Acceptance of Terms</Typography>
    <Typography variant="body2" paragraph>
      By accessing or using this application, you agree to be bound by these
      Terms of Service. If you do not agree, do not use the application.
    </Typography>

    <Typography variant="h6" gutterBottom>2. Use of the Service</Typography>
    <Typography variant="body2" paragraph>
      This application is provided for project management purposes. You agree
      to use it only for lawful purposes. You are responsible for maintaining
      the confidentiality of your account credentials.
    </Typography>

    <Typography variant="h6" gutterBottom>3. User Accounts</Typography>
    <Typography variant="body2" paragraph>
      You must provide accurate and complete information when creating an
      account. You are solely responsible for all activity that occurs under
      your account.
    </Typography>

    <Typography variant="h6" gutterBottom>4. Intellectual Property</Typography>
    <Typography variant="body2" paragraph>
      All content and features of this application are the property of their
      respective owners. You may not copy, modify, or distribute any part
      without prior written permission.
    </Typography>

    <Typography variant="h6" gutterBottom>5. Limitation of Liability</Typography>
    <Typography variant="body2" paragraph>
      The application is provided &quot;as is&quot; without warranties of any kind. We
      are not liable for any damages arising from your use of the service.
    </Typography>

    <Typography variant="h6" gutterBottom>6. Changes to Terms</Typography>
    <Typography variant="body2">
      We may update these terms at any time. Continued use of the application
      after changes constitutes acceptance of the updated terms.
    </Typography>
  </>
);

const PRIVACY_CONTENT = (
  <>
    <Typography variant="h6" gutterBottom>1. Information We Collect</Typography>
    <Typography variant="body2" paragraph>
      We collect information you provide directly, such as your name, email
      address, and password when you create an account. We also collect usage
      data to improve the application.
    </Typography>

    <Typography variant="h6" gutterBottom>2. How We Use Your Information</Typography>
    <Typography variant="body2" paragraph>
      We use your information to provide and improve the service, authenticate
      your identity, and respond to your support requests.
    </Typography>

    <Typography variant="h6" gutterBottom>3. Data Storage and Security</Typography>
    <Typography variant="body2" paragraph>
      Your data is stored securely using industry-standard encryption. No
      method of transmission over the internet is 100% secure.
    </Typography>

    <Typography variant="h6" gutterBottom>4. Sharing of Information</Typography>
    <Typography variant="body2" paragraph>
      We do not sell or share your personal information with third parties
      except as necessary to provide the service or as required by law.
    </Typography>

    <Typography variant="h6" gutterBottom>5. Cookies</Typography>
    <Typography variant="body2" paragraph>
      We use session cookies to keep you logged in. These are removed when
      you log out or close your browser.
    </Typography>

    <Typography variant="h6" gutterBottom>6. Your Rights</Typography>
    <Typography variant="body2">
      You have the right to access, correct, or delete your personal data at
      any time by contacting us through the application.
    </Typography>
  </>
);

export function PolicyModal({ type, open, onClose }: PolicyModalProps) {
  const title = type === "terms" ? "Terms of Service" : "Privacy Policy";
  const content = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <GenericButton
          label="Close"
          variant={ButtonVariant.Contained}
          onClick={onClose}
        />
      </DialogActions>
    </Dialog>
  );
}
