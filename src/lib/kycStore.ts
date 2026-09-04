'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCrudStore, DynamicCompanionItem } from './crudStore';

export type PoliceBgvStatus = 'NOT_STARTED' | 'PENDING_POLICE' | 'POLICE_VERIFIED' | 'FAILED';
export type SafetyTier = 'TIER_1_ID' | 'TIER_2_ADDRESS' | 'TIER_3_POLICE_ELITE';
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface KycApplicationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userDob?: string;
  userAge: number;
  userGender: string;
  userCountry: string;
  userState?: string;
  userCity: string;
  userPincode?: string;
  languages?: string[];
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  categories?: string[];
  skills?: string[];
  bio?: string;
  avatar?: string;
  photos?: string[];

  // Document & Biometrics Details
  type: string; // e.g. 'AADHAAR_CARD' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'PAN_CARD' | 'GOVERNMENT_ID'
  documentNumber: string;
  fileUrl: string; // Front Image
  fileUrlBack?: string; // Back Image
  selfieUrl: string; // Live Selfie
  utilityBillUrl?: string; // Address Proof
  ocrData?: {
    extractedName: string;
    extractedDocNum: string;
    confidenceScore: number;
  };
  livenessScore?: number;
  safetyTier?: SafetyTier;
  bgvStatus?: PoliceBgvStatus;
  renewalReminderSent?: boolean;

  // Status & Audit Log Activity
  status: KycStatus;
  rejectionReason?: string | null;
  submittedAt: string; // ISO date string
  createdAt: string;
  expiresAt: string;
  reviewedAt?: string | null; // Exact ISO date string when Approved or Rejected
  reviewedBy?: string | null; // e.g., 'Super Admin'
  reviewRemarks?: string | null; // Remarks entered during Approve or Reject
}

interface KycStoreState {
  applications: KycApplicationRecord[];
  
  // Actions
  addApplication: (item: Omit<KycApplicationRecord, 'id' | 'createdAt' | 'submittedAt'> & { id?: string }) => KycApplicationRecord;
  approveApplication: (id: string, remarks?: string, reviewerName?: string) => void;
  rejectApplication: (id: string, reason: string, remarks?: string, reviewerName?: string) => void;
  toggleBgvStatus: (id: string) => void;
  sendRenewalReminder: (id: string) => void;
  deleteApplication: (id: string) => void;
  clearAll: () => void;
}

export const useKycStore = create<KycStoreState>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (item) => {
        const id = item.id || `kyc-${Date.now()}`;
        const now = new Date().toISOString();
        const newRecord: KycApplicationRecord = {
          ...item,
          id,
          submittedAt: (item as any).submittedAt || now,
          createdAt: now,
          status: item.status || 'PENDING',
          rejectionReason: item.rejectionReason || null,
          reviewedAt: item.reviewedAt || null,
          reviewedBy: item.reviewedBy || null,
          reviewRemarks: item.reviewRemarks || null,
          safetyTier: item.safetyTier || 'TIER_1_ID',
          bgvStatus: item.bgvStatus || 'NOT_STARTED',
          livenessScore: item.livenessScore || 99.2,
          expiresAt: item.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0]
        };

        set((state) => {
          // Avoid duplicate applications with same email or userId
          const exists = state.applications.find(a => a.id === id || (a.userEmail && a.userEmail === item.userEmail));
          if (exists) {
            return {
              applications: state.applications.map(a => a.id === exists.id ? { ...a, ...newRecord } : a)
            };
          }
          return { applications: [newRecord, ...state.applications] };
        });

        return newRecord;
      },

      approveApplication: (id: string, remarks = 'Identity and biometric documents verified successfully. Approved for active platform companionship.', reviewerName = 'Super Admin') => {
        const now = new Date().toISOString();
        const targetApp = get().applications.find(a => a.id === id);

        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id === id) {
              const updatedTier: SafetyTier = app.bgvStatus === 'POLICE_VERIFIED' ? 'TIER_3_POLICE_ELITE' : 'TIER_2_ADDRESS';
              return {
                ...app,
                status: 'APPROVED',
                rejectionReason: null,
                reviewedAt: now,
                reviewedBy: reviewerName,
                reviewRemarks: remarks,
                safetyTier: updatedTier
              };
            }
            return app;
          })
        }));

        // Seamless Sync to Companion Management (useCrudStore)
        if (targetApp) {
          try {
            const crudStore = useCrudStore.getState();
            const existingCompanion = crudStore.companions.find(
              c => c.id === targetApp.userId || (targetApp.userEmail && c.email.toLowerCase() === targetApp.userEmail.toLowerCase())
            );

            if (existingCompanion) {
              crudStore.updateCompanion(existingCompanion.id, {
                status: 'ACTIVE',
                isActive: true,
                kycStatus: 'APPROVED',
                verificationBadge: true,
                ratingAvg: existingCompanion.ratingAvg || 5.0,
                aadhaarNumber: targetApp.documentNumber || existingCompanion.aadhaarNumber,
                name: targetApp.userName || existingCompanion.name,
                phone: targetApp.userPhone || existingCompanion.phone,
                city: targetApp.userCity || existingCompanion.city,
                country: targetApp.userCountry || existingCompanion.country,
                state: targetApp.userState || existingCompanion.state,
                pincode: targetApp.userPincode || existingCompanion.pincode,
                age: targetApp.userAge || existingCompanion.age,
                gender: targetApp.userGender || existingCompanion.gender,
                avatar: targetApp.avatar || targetApp.selfieUrl || existingCompanion.avatar,
                photos: targetApp.photos && targetApp.photos.length > 0 ? targetApp.photos : existingCompanion.photos,
                categories: targetApp.categories || existingCompanion.categories,
                skills: targetApp.skills || existingCompanion.skills,
                languages: targetApp.languages || existingCompanion.languages,
                hourlyRate: targetApp.hourlyRate || existingCompanion.hourlyRate,
                dailyRate: targetApp.dailyRate || existingCompanion.dailyRate,
                weeklyRate: targetApp.weeklyRate || existingCompanion.weeklyRate,
                bio: targetApp.bio || existingCompanion.bio
              });
            } else {
              crudStore.addCompanion({
                name: targetApp.userName,
                email: targetApp.userEmail,
                phone: targetApp.userPhone,
                city: targetApp.userCity || 'Mumbai',
                country: targetApp.userCountry || 'India',
                state: targetApp.userState || '',
                pincode: targetApp.userPincode || '',
                age: targetApp.userAge || 25,
                gender: targetApp.userGender || 'Female',
                avatar: targetApp.avatar || targetApp.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                photos: targetApp.photos && targetApp.photos.length > 0 ? targetApp.photos : [targetApp.avatar || targetApp.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'],
                hourlyRate: targetApp.hourlyRate || 75,
                dailyRate: targetApp.dailyRate || 350,
                weeklyRate: targetApp.weeklyRate || 2000,
                ratingAvg: 5.0,
                ratingCount: 0,
                completedBookings: 0,
                status: 'ACTIVE',
                category: targetApp.categories?.[0] || 'Event Companion',
                categories: targetApp.categories || ['Event Companion'],
                skills: targetApp.skills || ['Multilingual'],
                languages: targetApp.languages || ['English', 'Hindi'],
                bio: targetApp.bio || 'Verified Professional Companion',
                createdSource: 'USER_REGISTERED',
                aadhaarNumber: targetApp.documentNumber || '',
                kycStatus: 'APPROVED',
                verificationBadge: true
              });
            }
          } catch (syncErr) {
            console.warn('Failed to sync approved companion to crudStore:', syncErr);
          }
        }
      },

      rejectApplication: (id: string, reason: string, remarks = '', reviewerName = 'Super Admin') => {
        const now = new Date().toISOString();
        const targetApp = get().applications.find(a => a.id === id);

        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id === id) {
              return {
                ...app,
                status: 'REJECTED',
                rejectionReason: reason,
                reviewedAt: now,
                reviewedBy: reviewerName,
                reviewRemarks: remarks || `Application rejected: ${reason}`
              };
            }
            return app;
          })
        }));

        // Deactivate in Companion Management if present
        if (targetApp) {
          try {
            const crudStore = useCrudStore.getState();
            const existingCompanion = crudStore.companions.find(
              c => c.id === targetApp.userId || (targetApp.userEmail && c.email.toLowerCase() === targetApp.userEmail.toLowerCase())
            );
            if (existingCompanion) {
              crudStore.updateCompanion(existingCompanion.id, {
                status: 'INACTIVE',
                isActive: false,
                kycStatus: 'REJECTED',
                verificationBadge: false
              });
            }
          } catch (syncErr) {
            console.warn('Failed to sync rejection to crudStore:', syncErr);
          }
        }
      },

      toggleBgvStatus: (id: string) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id === id) {
              const nextStatus: PoliceBgvStatus = app.bgvStatus === 'POLICE_VERIFIED' ? 'PENDING_POLICE' : 'POLICE_VERIFIED';
              const nextTier: SafetyTier = nextStatus === 'POLICE_VERIFIED' ? 'TIER_3_POLICE_ELITE' : 'TIER_2_ADDRESS';
              return {
                ...app,
                bgvStatus: nextStatus,
                safetyTier: nextTier
              };
            }
            return app;
          })
        }));
      },

      sendRenewalReminder: (id: string) => {
        set((state) => ({
          applications: state.applications.map((app) => 
            app.id === id ? { ...app, renewalReminderSent: true } : app
          )
        }));
      },

      deleteApplication: (id: string) => {
        set((state) => ({
          applications: state.applications.filter(a => a.id !== id)
        }));
      },

      clearAll: () => set({ applications: [] })
    }),
    {
      name: 'sathi_kyc_applications_v2'
    }
  )
);
