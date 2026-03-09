const fs = require('fs');
const path = require('path');

// Data passed from Claude via command line arguments
const input = JSON.parse(process.argv[2]);

const {
    ideaName,
    intent,
    score,
    phases,
    redFlags,
    greenFlags,
    verdict,
    nextStep,
    rawNotes
} = input;

// Generate filename
const date = new Date().toISOString().split('T')[0];
const fileName = `${ideaName.toLowerCase().replace(/\s+/g, '-')}-${date}.md`;

// Output folder
const outputDir = path.join(process.cwd(), 'idea-validations');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read template
const template = fs.readFileSync(
    path.join(__dirname, 'template.md'),
    'utf8'
);

// Build phase table
const phaseTable = phases.map(p =>
    `| ${p.name} | ${p.score} | ${p.max} |`
).join('\n');

// Build red flags list
const redFlagsList = redFlags.map(f => `- ${f}`).join('\n');

// Build green flags list
const greenFlagsList = greenFlags.map(f => `- ${f}`).join('\n');

// Fill template
const output = template
    .replace('{{IDEA_NAME}}', ideaName)
    .replace('{{DATE}}', date)
    .replace('{{INTENT}}', intent)
    .replace('{{TOTAL_SCORE}}', score)
    .replace('{{VERDICT}}', verdict)
    .replace('{{PHASE_TABLE}}', phaseTable)
    .replace('{{RED_FLAGS}}', redFlagsList)
    .replace('{{GREEN_FLAGS}}', greenFlagsList)
    .replace('{{NEXT_STEP}}', nextStep)
    .replace('{{RAW_NOTES}}', rawNotes || 'N/A');

// Write file
const outputPath = path.join(outputDir, fileName);
fs.writeFileSync(outputPath, output);

console.log(`✅ Report generated: idea-validations/${fileName}`);