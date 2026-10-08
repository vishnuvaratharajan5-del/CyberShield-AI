import { PasswordAnalysisResult } from '../types';

// Common weak password dictionary & keyboard walks
const COMMON_WEAK_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'admin', 'welcome', 'letmein',
  'iloveyou', 'monkey', 'dragon', 'football', 'master', 'sunshine', 'princess',
  'login', 'pass123', 'admin123', 'root', 'cyber', 'security', 'cisco', 'default'
];

const KEYBOARD_PATTERNS = [
  'qwerty', 'asdfgh', 'zxcvbn', '123456', '234567', '345678', '456789', '987654'
];

/**
 * Client-Side Offline Password Security Analyzer
 * PRIVACY GUARANTEE: Never transmits input text across network or to external AI.
 */
export function analyzePasswordLocally(password: string): PasswordAnalysisResult {
  if (!password) {
    return {
      strength: 'VERY_WEAK',
      score: 0,
      entropy: 0,
      estimatedTimeToCrack: 'Instant',
      feedback: ['Please enter a password to evaluate security strength.'],
      warnings: [],
      passedChecks: {
        length: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        noCommonWords: true,
        noRepetition: true,
      }
    };
  }

  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  // Repetition check: e.g. "aaaa", "1111", repeating 3+ same chars in a row
  const hasRepetition = /(.)\1{2,}/.test(password);
  
  // Common pattern check
  const lower = password.toLowerCase();
  const containsCommonWord = COMMON_WEAK_PASSWORDS.some(word => lower.includes(word));
  const containsKeyboardWalk = KEYBOARD_PATTERNS.some(pat => lower.includes(pat));

  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33;

  // Calculate Shannon Entropy: H = L * log2(R)
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  // Calculate Score (0 - 100)
  let score = 0;
  const feedback: string[] = [];
  const warnings: string[] = [];

  // Length scoring
  if (length >= 16) {
    score += 35;
    feedback.push('Excellent length (16+ characters) provides high brute-force resistance.');
  } else if (length >= 12) {
    score += 25;
    feedback.push('Good length (12+ characters) meets modern enterprise standards.');
  } else if (length >= 8) {
    score += 15;
    feedback.push('Acceptable length (8+ characters), but longer (12+) is recommended.');
  } else {
    score += 5;
    warnings.push('Too short: Passwords under 8 characters can be cracked in seconds.');
  }

  // Character variety scoring
  let varietyCount = 0;
  if (hasUppercase) varietyCount++;
  if (hasLowercase) varietyCount++;
  if (hasNumber) varietyCount++;
  if (hasSpecial) varietyCount++;

  if (varietyCount === 4) {
    score += 35;
    feedback.push('Contains all 4 character categories: uppercase, lowercase, numbers, and symbols.');
  } else if (varietyCount === 3) {
    score += 22;
    feedback.push('Contains 3 character types. Adding symbols or varied cases increases strength.');
  } else if (varietyCount === 2) {
    score += 12;
    warnings.push('Limited character diversity. Mix numbers, uppercase letters, and symbols.');
  } else {
    score += 5;
    warnings.push('Only 1 character type detected. Extremely vulnerable to dictionary attacks.');
  }

  // Entropy bonus
  if (entropy > 70) score += 20;
  else if (entropy > 50) score += 12;
  else if (entropy > 35) score += 5;

  // Deductions for patterns
  if (containsCommonWord) {
    score = Math.max(10, score - 25);
    warnings.push('Contains common dictionary word or cybersecurity term easily guessed by attackers.');
  }
  if (containsKeyboardWalk) {
    score = Math.max(10, score - 20);
    warnings.push('Contains predictable keyboard sequence (e.g., qwerty or 123456).');
  }
  if (hasRepetition) {
    score = Math.max(10, score - 15);
    warnings.push('Contains repeated identical characters, reducing cryptographic randomness.');
  }

  // Cap score between 5 and 100
  score = Math.min(100, Math.max(5, score));

  // Determine strength label
  let strength: PasswordAnalysisResult['strength'];
  if (score >= 85) strength = 'VERY_STRONG';
  else if (score >= 70) strength = 'STRONG';
  else if (score >= 50) strength = 'MEDIUM';
  else if (score >= 30) strength = 'WEAK';
  else strength = 'VERY_WEAK';

  // Estimate crack time
  let estimatedTimeToCrack = 'Instant (< 1 sec)';
  if (entropy > 80 && !containsCommonWord && !containsKeyboardWalk) {
    estimatedTimeToCrack = 'Centuries (Billions of years)';
  } else if (entropy > 65) {
    estimatedTimeToCrack = 'Decades (300+ years)';
  } else if (entropy > 50) {
    estimatedTimeToCrack = 'Months to Years';
  } else if (entropy > 35) {
    estimatedTimeToCrack = 'Few hours to days';
  } else if (length >= 8 && varietyCount >= 2) {
    estimatedTimeToCrack = 'Minutes';
  }

  return {
    strength,
    score,
    entropy,
    estimatedTimeToCrack,
    feedback,
    warnings,
    passedChecks: {
      length: length >= 12,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
      noCommonWords: !containsCommonWord && !containsKeyboardWalk,
      noRepetition: !hasRepetition,
    }
  };
}
