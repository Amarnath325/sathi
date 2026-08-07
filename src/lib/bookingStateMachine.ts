/**
 * COMPANION CONNECT — STRICT BOOKING LIFECYCLE STATE MACHINE
 * Backend-owned state transitions preventing arbitrary status spoofing.
 */

export type BookingStatusType = 
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'PAYMENT_AUTHORIZED'
  | 'CONFIRMED'
  | 'STARTED'
  | 'COMPLETED'
  | 'SETTLEMENT_PENDING'
  | 'RELEASED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface TransitionRequest {
  bookingId: string;
  currentStatus: BookingStatusType;
  targetStatus: BookingStatusType;
  actorId: string;
  actorRole: 'USER' | 'VERIFIED_COMPANION' | 'ADMIN' | 'SYSTEM';
  reason?: string;
}

export interface TransitionResult {
  success: boolean;
  newStatus?: BookingStatusType;
  error?: string;
  allowedActors?: string[];
  auditMessage?: string;
}

// Strict Allowed State Transitions Map
const STATE_TRANSITION_MATRIX: Record<BookingStatusType, { allowedNext: BookingStatusType[]; authorizedRoles: Array<'USER' | 'VERIFIED_COMPANION' | 'ADMIN' | 'SYSTEM'> }> = {
  REQUESTED: {
    allowedNext: ['ACCEPTED', 'DECLINED', 'CANCELLED'],
    authorizedRoles: ['VERIFIED_COMPANION', 'USER', 'ADMIN', 'SYSTEM']
  },
  ACCEPTED: {
    allowedNext: ['PAYMENT_AUTHORIZED', 'CANCELLED'],
    authorizedRoles: ['USER', 'ADMIN', 'SYSTEM']
  },
  PAYMENT_AUTHORIZED: {
    allowedNext: ['CONFIRMED', 'CANCELLED', 'DISPUTED'],
    authorizedRoles: ['SYSTEM', 'ADMIN']
  },
  CONFIRMED: {
    allowedNext: ['STARTED', 'CANCELLED', 'DISPUTED'],
    authorizedRoles: ['VERIFIED_COMPANION', 'USER', 'ADMIN', 'SYSTEM']
  },
  STARTED: {
    allowedNext: ['COMPLETED', 'DISPUTED'],
    authorizedRoles: ['VERIFIED_COMPANION', 'USER', 'ADMIN', 'SYSTEM']
  },
  COMPLETED: {
    allowedNext: ['SETTLEMENT_PENDING', 'DISPUTED'],
    authorizedRoles: ['SYSTEM', 'USER', 'ADMIN']
  },
  SETTLEMENT_PENDING: {
    allowedNext: ['RELEASED', 'DISPUTED'],
    authorizedRoles: ['SYSTEM', 'ADMIN']
  },
  RELEASED: {
    allowedNext: [], // Terminal State
    authorizedRoles: ['ADMIN']
  },
  DECLINED: {
    allowedNext: [], // Terminal State
    authorizedRoles: ['ADMIN']
  },
  CANCELLED: {
    allowedNext: [], // Terminal State
    authorizedRoles: ['ADMIN']
  },
  DISPUTED: {
    allowedNext: ['COMPLETED', 'CANCELLED', 'RELEASED'],
    authorizedRoles: ['ADMIN']
  }
};

export class BookingStateMachine {
  /**
   * Evaluates and executes state transition request
   */
  public static transition(request: TransitionRequest): TransitionResult {
    const config = STATE_TRANSITION_MATRIX[request.currentStatus];

    if (!config) {
      return {
        success: false,
        error: `Invalid current booking status '${request.currentStatus}'.`
      };
    }

    // Check if target state is a valid next state
    if (!config.allowedNext.includes(request.targetStatus)) {
      return {
        success: false,
        error: `Illegal state transition from '${request.currentStatus}' to '${request.targetStatus}'.`
      };
    }

    // Check if actor has permission for this transition
    if (!config.authorizedRoles.includes(request.actorRole)) {
      return {
        success: false,
        error: `Role '${request.actorRole}' is not authorized to transition booking from '${request.currentStatus}' to '${request.targetStatus}'.`
      };
    }

    // Special validation checks
    if (request.targetStatus === 'DISPUTED' && !request.reason) {
      return {
        success: false,
        error: `A detailed dispute reason is required when transitioning to DISPUTED status.`
      };
    }

    return {
      success: true,
      newStatus: request.targetStatus,
      auditMessage: `Booking ${request.bookingId} successfully transitioned from ${request.currentStatus} to ${request.targetStatus} by ${request.actorRole} (${request.actorId}).`
    };
  }
}
