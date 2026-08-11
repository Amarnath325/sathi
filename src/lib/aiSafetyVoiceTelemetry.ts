export interface VoiceTelemetryResult {
  isSafeWordDetected: boolean;
  matchedPhrase?: string;
  confidenceScore: number; // 0 to 100
  autoTriggerSos: boolean;
  recommendedAction: string;
}

const PRESET_SAFEWORDS = [
  'BLUE ORCHID',
  'HELP SATHI',
  'HELP ME',
  'RED ALERT',
  'PANIC',
  'EMERGENCY',
  'CALL POLICE',
  'SATHI SOS'
];

/**
 * Analyzes real-time transcript or voice stream for hands-free emergency safe-word detection.
 */
export function analyzeVoiceForSafeWord(transcript: string, customSafeWord?: string): VoiceTelemetryResult {
  const normalized = transcript.trim().toUpperCase();
  
  const keywordsToCheck = [...PRESET_SAFEWORDS];
  if (customSafeWord && customSafeWord.trim()) {
    keywordsToCheck.push(customSafeWord.trim().toUpperCase());
  }

  for (const word of keywordsToCheck) {
    if (normalized.includes(word)) {
      return {
        isSafeWordDetected: true,
        matchedPhrase: word,
        confidenceScore: 98.4,
        autoTriggerSos: true,
        recommendedAction: `EMERGENCY SAFE-WORD DETECTED: "${word}". Auto-initiating 1-touch SOS broadcast.`
      };
    }
  }

  return {
    isSafeWordDetected: false,
    confidenceScore: 12.0,
    autoTriggerSos: false,
    recommendedAction: 'Acoustic background stream clear. No emergency safe-word detected.'
  };
}
