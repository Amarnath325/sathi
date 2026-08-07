/**
 * COMPANION CONNECT — TYPE-SAFE API CLIENT SERVICES
 * Unified abstraction layer for server communication across User, Companion, and Marketplace operations.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 1. Auth API
export const authApi = {
  login: async (credentials: any): Promise<ApiResponse> => {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  sendOtp: async (phoneOrEmail: string): Promise<ApiResponse> => {
    return { success: true, message: 'OTP sent successfully' };
  },
  verifyOtp: async (phoneOrEmail: string, code: string): Promise<ApiResponse> => {
    return { success: true, message: 'OTP verified successfully' };
  }
};

// 2. User & Profile API
export const userApi = {
  getProfile: async (userId: string): Promise<ApiResponse> => {
    const res = await fetch(`/api/admin/users/${userId}`);
    return res.json();
  },
  updateProfile: async (userId: string, data: any): Promise<ApiResponse> => {
    return { success: true, data };
  }
};

// 3. Companion & Services API
export const companionApi = {
  submitOnboarding: async (payload: any): Promise<ApiResponse> => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getServicesPolicy: async (query?: string): Promise<ApiResponse> => {
    const res = await fetch('/api/services/policy');
    return res.json();
  }
};

// 4. Search & Matching API
export const searchApi = {
  matchCandidates: async (criteria: any): Promise<ApiResponse> => {
    const res = await fetch('/api/search/matching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    return res.json();
  }
};

// 5. Booking State Machine API
export const bookingApi = {
  transitionState: async (payload: { bookingId: string; targetStatus: string; actorId: string; actorRole: string }): Promise<ApiResponse> => {
    const res = await fetch('/api/bookings/state-machine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};

// 6. Payment & Financial Ledger API
export const paymentApi = {
  processLedgerSplit: async (payload: any): Promise<ApiResponse> => {
    const res = await fetch('/api/payments/ledger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};

// 7. Chat Moderation API
export const chatApi = {
  moderateMessage: async (payload: { text: string; bookingConfirmed?: boolean }): Promise<ApiResponse> => {
    const res = await fetch('/api/chat/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
