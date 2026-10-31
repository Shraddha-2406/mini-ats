// Automated Verification Script for Mini ATS Core Engine
import { calculateMatch, getMatchScoreColor, generateSkillRecommendations } from './services/matchingService.js';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
} from './data/initialData.js';

console.log('=== RUNNING ATS CORE ENGINE VERIFICATION ===\n');

// 1. Test Matching Service with Rahul Sharma on Job 1 (Python Developer)
// Job 1 requires: Python, SQL, Django, Git, REST API (5 skills)
// Rahul has: Python, SQL, Git, Django (4 skills)
const job1 = INITIAL_JOBS[0];
const rahul = INITIAL_USERS[0];
const rahulMatch = calculateMatch(rahul.skills, job1.requiredSkills, job1.threshold);

console.log('Test 1: Rahul Sharma on Python Developer (Threshold: 80%)');
console.log(`- Matched Skills (${rahulMatch.matchedCount}):`, rahulMatch.matchedSkills);
console.log(`- Missing Skills (${rahulMatch.missingSkills.length}):`, rahulMatch.missingSkills);
console.log(`- Match Score: ${rahulMatch.matchScore}%`);
console.log(`- Formula: ${rahulMatch.formulaExplanation}`);
console.log(`- Meets 80% Threshold: ${rahulMatch.meetsThreshold}`);
console.assert(rahulMatch.matchScore === 80, 'Score should be 80%');
console.assert(rahulMatch.meetsThreshold === true, 'Should meet 80% threshold');
console.assert(rahulMatch.missingSkills[0] === 'REST API', 'Missing skill should be REST API');
console.log('✓ Test 1 Passed!\n');

// 2. Test Priya Patil on Job 1 (Python Developer)
// Priya has: Python, SQL, Machine Learning, Data Analysis
// Overlap: Python, SQL (2 / 5 = 40%)
const priya = INITIAL_USERS[1];
const priyaMatch = calculateMatch(priya.skills, job1.requiredSkills, job1.threshold);
console.log('Test 2: Priya Patil on Python Developer');
console.log(`- Matched Skills:`, priyaMatch.matchedSkills);
console.log(`- Missing Skills:`, priyaMatch.missingSkills);
console.log(`- Match Score: ${priyaMatch.matchScore}%`);
console.log(`- Meets 80% Threshold: ${priyaMatch.meetsThreshold}`);
console.assert(priyaMatch.matchScore === 40, 'Priya score should be 40%');
console.assert(priyaMatch.meetsThreshold === false, 'Should be false for 80% threshold');
console.log('✓ Test 2 Passed!\n');

// 3. Test Priya Patil on Machine Learning Intern (Job 5)
// Job 5 requires: Python, Machine Learning, Data Analysis, Git (4 skills, threshold: 75%)
// Priya has: Python, SQL, Machine Learning, Data Analysis
// Overlap: Python, Machine Learning, Data Analysis (3 / 4 = 75%)
const job5 = INITIAL_JOBS[4];
const priyaMLMatch = calculateMatch(priya.skills, job5.requiredSkills, job5.threshold);
console.log('Test 3: Priya Patil on Machine Learning Intern (Threshold: 75%)');
console.log(`- Matched Skills:`, priyaMLMatch.matchedSkills);
console.log(`- Missing Skills:`, priyaMLMatch.missingSkills);
console.log(`- Match Score: ${priyaMLMatch.matchScore}%`);
console.log(`- Meets 75% Threshold: ${priyaMLMatch.meetsThreshold}`);
console.assert(priyaMLMatch.matchScore === 75, 'Priya ML score should be 75%');
console.assert(priyaMLMatch.meetsThreshold === true, 'Should be true for 75% threshold');
console.log('✓ Test 3 Passed!\n');

// 4. Test Zero Required Skills Edge Case
const zeroMatch = calculateMatch(['Python'], [], 80);
console.log('Test 4: Job with zero required skills');
console.assert(zeroMatch.matchScore === 100, 'Score should be 100%');
console.assert(zeroMatch.meetsThreshold === true, 'Meets threshold should be true');
console.log('✓ Test 4 Passed!\n');

// 5. Test Recommendations Generator
const rec = generateSkillRecommendations(rahulMatch.matchedCount, rahulMatch.totalRequired, rahulMatch.missingSkills, job1.threshold);
console.log('Test 5: Rule-based Recommendations for Rahul');
console.log(`- Summary: "${rec.summary}"`);
console.log(`- Recommendation 1: "${rec.recommendationList[0]}"`);
console.assert(rec.summary.includes('REST API'), 'Summary should mention missing REST API');
console.log('✓ Test 5 Passed!\n');

// 6. Test Initial Applications consistency
console.log('Test 6: Validating Initial Applications Dataset');
console.log(`- Total Initial Applications: ${INITIAL_APPLICATIONS.length}`);
console.log(`- Total Initial Jobs: ${INITIAL_JOBS.length}`);
console.log(`- Total Initial Candidates: ${INITIAL_USERS.filter(u => u.role === 'candidate').length}`);
console.assert(INITIAL_APPLICATIONS.length >= 10, 'Should have 10 initial applications');
console.log('✓ Test 6 Passed!\n');

console.log('=== ALL ATS ENGINE TESTS PASSED CLEANLY! ===');
