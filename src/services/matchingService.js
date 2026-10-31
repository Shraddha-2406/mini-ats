/**
 * Skill Matching Algorithm Service
 * 
 * Provides deterministic calculation comparing candidate skills with job requirements.
 * Designed to mirror future backend Python Flask / MySQL relational query calculations.
 */

/**
 * Normalize skill names (trimmed, lowercase, handling punctuation like C++, REST API)
 * @param {string} skill 
 * @returns {string}
 */
export const normalizeSkill = (skill) => {
  if (!skill) return '';
  return skill.trim().toLowerCase();
};

/**
 * Calculates skill matching score and identifies matched vs missing skills
 * 
 * @param {string[]} candidateSkills - Array of skills possessed by the candidate
 * @param {string[]} requiredSkills - Array of skills required by the job
 * @param {number} threshold - Job's minimum threshold percentage for shortlisting (e.g., 80)
 * @returns {Object} Match analysis results
 */
export const calculateMatch = (candidateSkills = [], requiredSkills = [], threshold = 80) => {
  const safeReqSkills = Array.isArray(requiredSkills) ? requiredSkills : [];
  const safeCandSkills = Array.isArray(candidateSkills) ? candidateSkills : [];

  // Edge case: Job has 0 required skills
  if (safeReqSkills.length === 0) {
    return {
      matchScore: 100,
      matchedSkills: [],
      missingSkills: [],
      additionalSkills: [...safeCandSkills],
      totalRequired: 0,
      matchedCount: 0,
      missingCount: 0,
      meetsThreshold: true,
      threshold,
      formulaExplanation: '0 required skills specified (100% default match)',
    };
  }

  // Create normalized lookup map for candidate skills
  const candidateNormMap = new Map();
  safeCandSkills.forEach((s) => {
    candidateNormMap.set(normalizeSkill(s), s);
  });

  const matchedSkills = [];
  const missingSkills = [];

  // Compare required skills against candidate's skills
  safeReqSkills.forEach((reqSkill) => {
    const normReq = normalizeSkill(reqSkill);
    if (candidateNormMap.has(normReq)) {
      // Use original job skill casing for display consistency
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate unique skills possessed by candidate that weren't required (bonus skills)
  const reqNormSet = new Set(safeReqSkills.map(normalizeSkill));
  const additionalSkills = safeCandSkills.filter(
    (candSkill) => !reqNormSet.has(normalizeSkill(candSkill))
  );

  const matchedCount = matchedSkills.length;
  const totalRequired = safeReqSkills.length;
  const matchScore = Math.round((matchedCount / totalRequired) * 100);
  const meetsThreshold = matchScore >= threshold;

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    additionalSkills,
    totalRequired,
    matchedCount,
    missingCount: missingSkills.length,
    meetsThreshold,
    threshold,
    formulaExplanation: `(${matchedCount} Matched / ${totalRequired} Required) × 100 = ${matchScore}%`,
  };
};

/**
 * Returns color category for a given match score
 * - 80-100%: Green (High Match)
 * - 50-79%: Amber (Moderate Match)
 * - 0-49%: Red (Low Match)
 */
export const getMatchScoreColor = (score) => {
  if (score >= 80) {
    return {
      category: 'high',
      label: 'High Match',
      textClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      ringColor: '#10b981', // emerald-500
      progressBg: 'bg-emerald-500',
    };
  }
  if (score >= 50) {
    return {
      category: 'moderate',
      label: 'Moderate Match',
      textClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      ringColor: '#f59e0b', // amber-500
      progressBg: 'bg-amber-500',
    };
  }
  return {
    category: 'low',
    label: 'Low Match',
    textClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    ringColor: '#ef4444', // rose-500
    progressBg: 'bg-rose-500',
  };
};

/**
 * Generates deterministic rule-based learning suggestions based on skill gaps
 */
export const generateSkillRecommendations = (matchedCount, totalRequired, missingSkills, targetThreshold = 80) => {
  if (missingSkills.length === 0) {
    return {
      summary: 'Outstanding fit! You possess 100% of the required technical skills for this position.',
      recommendationList: [
        'Review recent production case studies and prepare system architecture discussions for your interview.',
        'Highlight your hands-on project accomplishments matching these skills in your application notes.'
      ],
      improvementPotential: 0
    };
  }

  const missingListStr = missingSkills.slice(0, 3).join(', ') + (missingSkills.length > 3 ? ' and more' : '');
  const potentialScoreAfter1Skill = Math.round(((matchedCount + 1) / totalRequired) * 100);

  return {
    summary: `You match ${matchedCount} out of ${totalRequired} required skills. Learning ${missingListStr} will directly qualify you for this role.`,
    recommendationList: [
      `Acquiring even 1 more skill (e.g., "${missingSkills[0]}") will elevate your match to ${potentialScoreAfter1Skill}%.`,
      missingSkills.length > 1
        ? `Focus next on ${missingSkills.slice(0, 2).join(' and ')} to comfortably surpass the ${targetThreshold}% shortlisting threshold.`
        : `Completing a project with ${missingSkills[0]} will bring you to 100% eligibility.`,
      'Add certifications, GitHub repositories, or coursework to your profile as you master these technologies.'
    ],
    improvementPotential: 100 - Math.round((matchedCount / totalRequired) * 100)
  };
};
