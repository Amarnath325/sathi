import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptCredential, decryptCredential } from '@/lib/cryptoUtils';

export interface SmtpSettings {
  driver: 'SMTP' | 'GMAIL' | 'SENDGRID' | 'AWS_SES' | 'MAILGUN' | 'POSTMARK';
  host: string;
  port: number;
  username: string;
  password: string; // Encrypted in store
  encryption: 'TLS' | 'SSL' | 'NONE';
  fromName: string;
  fromEmail: string;
  isVerified: boolean;
  lastTestedAt?: string;
  isEncryptedInDb: boolean;
}

export interface EmailTemplateSection {
  id: string;
  title: string;
  type: 'HEADER' | 'BODY' | 'BUTTON' | 'CALLOUT' | 'FOOTER' | 'GRID';
  content: string;
  order: number;
}

export interface EmailTemplate {
  id: string;
  code: string;
  title: string;
  subject: string;
  category: 'Authentication' | 'Bookings' | 'Escrow' | 'Security' | 'System';
  status: 'ACTIVE' | 'DRAFT' | 'INACTIVE';
  bodyHtml: string;
  sections: EmailTemplateSection[];
  variables: string[];
  updatedAt: string;
}

interface EmailConfigState {
  smtpSettings: SmtpSettings;
  templates: EmailTemplate[];
  updateSmtpSettings: (settings: Partial<SmtpSettings>) => void;
  getDecryptedSmtpSettings: () => SmtpSettings;
  verifySmtpConnection: (testEmail: string) => Promise<{ success: boolean; message: string; exceptionCode?: string }>;
  addTemplate: (template: Omit<EmailTemplate, 'id' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updated: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  reorderTemplateSections: (templateId: string, sectionId: string, direction: 'UP' | 'DOWN') => void;
  addTemplateSection: (templateId: string, section: Omit<EmailTemplateSection, 'id' | 'order'>) => void;
  deleteTemplateSection: (templateId: string, sectionId: string) => void;
}

const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  driver: 'SMTP',
  host: '',
  port: 587,
  username: '',
  password: '',
  encryption: 'TLS',
  fromName: '',
  fromEmail: '',
  isVerified: false,
  isEncryptedInDb: false
};

const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-101',
    code: 'USER_WELCOME_OTP',
    title: 'User Registration & 6-Digit OTP Verification',
    subject: 'Welcome to Sathi! Your Verification Code is {{otp_code}}',
    category: 'Authentication',
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    variables: ['user_name', 'otp_code', 'company_name', 'support_link'],
    bodyHtml: `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 30px; color: #f8fafc; border-radius: 16px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #6366f1; margin: 0;">Sathi Companion Connect</h2>
    <p style="color: #94a3b8; font-size: 13px;">Secure Identity Verification</p>
  </div>
  <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
    <h3 style="color: #ffffff; margin-top: 0;">Hello {{user_name}},</h3>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Thank you for registering on Sathi. Please use the 6-digit verification code below to complete your authentication:</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #fbbf24; background-color: #0f172a; padding: 12px 24px; border-radius: 8px; border: 1px solid #475569;">{{otp_code}}</span>
    </div>
    <p style="color: #94a3b8; font-size: 12px;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #64748b;">
    © 2026 {{company_name}}. All rights reserved. | <a href="{{support_link}}" style="color: #818cf8; text-decoration: none;">Support Portal</a>
  </div>
</div>
    `.trim(),
    sections: [
      { id: 'sec-1', title: 'Header Branding', type: 'HEADER', content: 'Sathi Companion Connect', order: 1 },
      { id: 'sec-2', title: 'Welcome Greeting', type: 'BODY', content: 'Hello {{user_name}}, thank you for joining.', order: 2 },
      { id: 'sec-3', title: 'OTP Code Display Box', type: 'CALLOUT', content: 'Verification Code: {{otp_code}}', order: 3 },
      { id: 'sec-4', title: 'Security Warning Note', type: 'BODY', content: 'Valid for 10 minutes. Keep secure.', order: 4 },
      { id: 'sec-5', title: 'Footer Links & Copyright', type: 'FOOTER', content: '© 2026 {{company_name}}', order: 5 }
    ]
  },
  {
    id: 'tmpl-102',
    code: 'BOOKING_CONFIRMED',
    title: 'Companion Escrow Booking Confirmation',
    subject: 'Booking Confirmed! You are paired with {{companion_name}} (Ref: {{booking_id}})',
    category: 'Bookings',
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    variables: ['user_name', 'companion_name', 'booking_id', 'booking_date', 'amount', 'support_link'],
    bodyHtml: `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 30px; color: #f8fafc; border-radius: 16px;">
  <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #10b981;">
    <h2 style="color: #10b981; margin-top: 0;">🎉 Booking Confirmed!</h2>
    <p style="color: #cbd5e1; font-size: 14px;">Hi {{user_name}}, your booking reservation has been locked into Escrow protection.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; color: #e2e8f0; font-size: 13px;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #334155;"><strong>Companion:</strong></td><td style="padding: 8px; border-bottom: 1px solid #334155; color: #34d399;">{{companion_name}}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #334155;"><strong>Booking Reference:</strong></td><td style="padding: 8px; border-bottom: 1px solid #334155; font-family: monospace;">{{booking_id}}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #334155;"><strong>Date & Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #334155;">{{booking_date}}</td></tr>
      <tr><td style="padding: 8px;"><strong>Total Amount:</strong></td><td style="padding: 8px; color: #fbbf24; font-weight: bold;">₹{{amount}}</td></tr>
    </table>
    <div style="text-align: center; margin-top: 20px;">
      <a href="{{support_link}}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">View Booking Status</a>
    </div>
  </div>
</div>
    `.trim(),
    sections: [
      { id: 'sec-10', title: 'Header Confirmation', type: 'HEADER', content: '🎉 Booking Confirmed!', order: 1 },
      { id: 'sec-11', title: 'Booking Details Table', type: 'GRID', content: 'Companion: {{companion_name}}, Date: {{booking_date}}', order: 2 },
      { id: 'sec-12', title: 'Escrow Lock Note', type: 'CALLOUT', content: 'Funds locked in Escrow protection', order: 3 },
      { id: 'sec-13', title: 'Action Button', type: 'BUTTON', content: 'View Booking Status', order: 4 }
    ]
  }
];

export const useEmailConfigStore = create<EmailConfigState>()(
  persist(
    (set, get) => ({
      smtpSettings: DEFAULT_SMTP_SETTINGS,
      templates: DEFAULT_EMAIL_TEMPLATES,

      updateSmtpSettings: (settings) =>
        set((state) => {
          const updatedPass = settings.password
            ? encryptCredential(settings.password)
            : state.smtpSettings.password;

          return {
            smtpSettings: {
              ...state.smtpSettings,
              ...settings,
              password: updatedPass,
              isEncryptedInDb: true
            }
          };
        }),

      getDecryptedSmtpSettings: () => {
        const current = get().smtpSettings;
        return {
          ...current,
          password: decryptCredential(current.password)
        };
      },

      verifySmtpConnection: async (testEmail: string) => {
        const decryptedSettings = get().getDecryptedSmtpSettings();

        try {
          const response = await fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toEmail: testEmail,
              subject: '⚡ Sathi Live SMTP Connection Verification',
              bodyHtml: `<p>SMTP Live handshake verified successfully for <strong>${decryptedSettings.fromEmail}</strong>.</p>`,
              smtpConfig: decryptedSettings
            })
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            return {
              success: false,
              message: data.message || 'SMTP Authentication / Connection Refused Exception.',
              exceptionCode: data.exceptionCode || 'SMTP_AUTH_ERROR'
            };
          }

          set((state) => ({
            smtpSettings: {
              ...state.smtpSettings,
              isVerified: true,
              lastTestedAt: new Date().toISOString()
            }
          }));

          return {
            success: true,
            message: `Success! Live test email dispatched to ${testEmail} via ${decryptedSettings.host}:${decryptedSettings.port} (${decryptedSettings.encryption}).`
          };
        } catch (err: any) {
          return {
            success: false,
            message: `Exception: ${err?.message || 'Network exception while connecting to SMTP Gateway.'}`,
            exceptionCode: 'GATEWAY_NETWORK_EXCEPTION'
          };
        }
      },

      addTemplate: (newTmpl) =>
        set((state) => ({
          templates: [
            ...state.templates,
            {
              ...newTmpl,
              id: `tmpl-${Date.now()}`,
              updatedAt: new Date().toISOString()
            }
          ]
        })),

      updateTemplate: (id, updated) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t
          )
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id)
        })),

      duplicateTemplate: (id) => {
        const target = get().templates.find((t) => t.id === id);
        if (!target) return;

        const duplicated: EmailTemplate = {
          ...target,
          id: `tmpl-${Date.now()}`,
          code: `${target.code}_COPY`,
          title: `${target.title} (Copy)`,
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          templates: [...state.templates, duplicated]
        }));
      },

      reorderTemplateSections: (templateId, sectionId, direction) =>
        set((state) => {
          return {
            templates: state.templates.map((tmpl) => {
              if (tmpl.id !== templateId) return tmpl;

              const sections = [...tmpl.sections].sort((a, b) => a.order - b.order);
              const idx = sections.findIndex((s) => s.id === sectionId);

              if (idx === -1) return tmpl;

              if (direction === 'UP' && idx > 0) {
                const temp = sections[idx].order;
                sections[idx].order = sections[idx - 1].order;
                sections[idx - 1].order = temp;
              } else if (direction === 'DOWN' && idx < sections.length - 1) {
                const temp = sections[idx].order;
                sections[idx].order = sections[idx + 1].order;
                sections[idx + 1].order = temp;
              }

              return {
                ...tmpl,
                sections: sections.sort((a, b) => a.order - b.order),
                updatedAt: new Date().toISOString()
              };
            })
          };
        }),

      addTemplateSection: (templateId, sectionData) =>
        set((state) => ({
          templates: state.templates.map((tmpl) => {
            if (tmpl.id !== templateId) return tmpl;
            const newOrder = tmpl.sections.length + 1;
            const newSec: EmailTemplateSection = {
              ...sectionData,
              id: `sec-${Date.now()}`,
              order: newOrder
            };
            return {
              ...tmpl,
              sections: [...tmpl.sections, newSec],
              updatedAt: new Date().toISOString()
            };
          })
        })),

      deleteTemplateSection: (templateId, sectionId) =>
        set((state) => ({
          templates: state.templates.map((tmpl) => {
            if (tmpl.id !== templateId) return tmpl;
            return {
              ...tmpl,
              sections: tmpl.sections.filter((s) => s.id !== sectionId),
              updatedAt: new Date().toISOString()
            };
          })
        }))
    }),
    {
      name: 'sathi-email-config-storage'
    }
  )
);
