"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMatrixAndMathProblems = generateMatrixAndMathProblems;
exports.generatePhysicsProblems = generatePhysicsProblems;
exports.generateChemistryProblems = generateChemistryProblems;
exports.generateAIQuestions = generateAIQuestions;
const index_js_1 = require("../db/index.js");
// Mathematical & Scientific Numerical Problem Generators
function generateMatrixAndMathProblems(subject, diff) {
    const problems = [];
    // 1. Matrix Determinant Problem
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 4) + 1;
    const c = Math.floor(Math.random() * 3) + 1;
    const d = Math.floor(Math.random() * 5) + 3;
    const det = a * d - b * c;
    problems.push({
        subject: subject || 'Linear Algebra',
        difficulty: diff,
        question_text: `What is the determinant of the 2×2 matrix A = [[${a}, ${b}], [${c}, ${d}]]?`,
        options: [
            `${det}`,
            `${det + a + b}`,
            `${a * d + b * c}`,
            `${det - c - 1}`
        ],
        correct_option: 0,
        explanation: `For a 2×2 matrix [[a, b], [c, d]], the determinant is calculated as det(A) = (a × d) - (b × c) = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}.`,
        source: 'ai_generated'
    });
    // 2. Matrix Trace Problem
    const tr = a + d;
    problems.push({
        subject: subject || 'Linear Algebra',
        difficulty: diff,
        question_text: `What is the trace of the 2×2 matrix [[${a}, ${b}], [${c}, ${d}]]?`,
        options: [
            `${tr}`,
            `${a * d}`,
            `${b + c}`,
            `${det}`
        ],
        correct_option: 0,
        explanation: `The trace of a square matrix is the sum of its main diagonal elements: Trace = ${a} + ${d} = ${tr}.`,
        source: 'ai_generated'
    });
    // 3. Matrix Scalar Multiplication
    problems.push({
        subject: subject || 'Linear Algebra',
        difficulty: diff,
        question_text: `If matrix A = [[${a}, 0], [0, ${d}]], what is the scalar multiple 2A?`,
        options: [
            `[[${2 * a}, 0], [0, ${2 * d}]]`,
            `[[${a + 2}, 0], [0, ${d + 2}]]`,
            `[[${a}, 2], [2, ${d}]]`,
            `[[${a * a}, 0], [0, ${d * d}]]`
        ],
        correct_option: 0,
        explanation: `Multiplying a matrix by scalar k multiplies every entry by k: 2 × [[${a}, 0], [0, ${d}]] = [[${2 * a}, 0], [0, ${2 * d}]].`,
        source: 'ai_generated'
    });
    // 4. Matrix Invertibility Condition
    problems.push({
        subject: subject || 'Linear Algebra',
        difficulty: diff,
        question_text: `Under what condition is a square matrix A guaranteed to be invertible (non-singular)?`,
        options: [
            `Its determinant is non-zero (det(A) ≠ 0)`,
            `Its determinant is equal to 0 (det(A) = 0)`,
            `All its diagonal elements are negative`,
            `It has an odd number of rows and columns`
        ],
        correct_option: 0,
        explanation: `A square matrix is invertible if and only if its determinant is non-zero (det(A) ≠ 0).`,
        source: 'ai_generated'
    });
    // 5. Quadratic Roots Problem (Algebra)
    const r1 = Math.floor(Math.random() * 4) + 2;
    const r2 = Math.floor(Math.random() * 4) + 5;
    const sumR = r1 + r2;
    const prodR = r1 * r2;
    problems.push({
        subject: subject || 'Algebra',
        difficulty: diff,
        question_text: `What are the roots of the quadratic equation x² - ${sumR}x + ${prodR} = 0?`,
        options: [
            `x = ${r1} and x = ${r2}`,
            `x = -${r1} and x = -${r2}`,
            `x = ${r1 + 1} and x = ${r2 - 1}`,
            `x = ${sumR} and x = ${prodR}`
        ],
        correct_option: 0,
        explanation: `Factoring the quadratic equation gives (x - ${r1})(x - ${r2}) = 0, so the roots are x = ${r1} and x = ${r2}.`,
        source: 'ai_generated'
    });
    // 6. Calculus Derivative Problem
    const coef = Math.floor(Math.random() * 4) + 2;
    const pwr = 3;
    const dCoef = coef * pwr;
    problems.push({
        subject: subject || 'Calculus',
        difficulty: diff,
        question_text: `What is the derivative with respect to x of the function f(x) = ${coef}x³ - 5x + 7?`,
        options: [
            `${dCoef}x² - 5`,
            `${coef}x² - 5`,
            `${dCoef}x³ - 5`,
            `${dCoef}x² + 7`
        ],
        correct_option: 0,
        explanation: `Applying the power rule: d/dx(${coef}x³) = ${coef} × 3x² = ${dCoef}x², and d/dx(-5x) = -5. The derivative of constant 7 is 0. So f'(x) = ${dCoef}x² - 5.`,
        source: 'ai_generated'
    });
    // 7. Definite Integral Problem
    const k = Math.floor(Math.random() * 3) + 2;
    const intVal = k * k;
    problems.push({
        subject: subject || 'Calculus',
        difficulty: diff,
        question_text: `Evaluate the definite integral ∫ from 0 to ${k} of (2x) dx:`,
        options: [
            `${intVal}`,
            `${2 * k}`,
            `${intVal + 2}`,
            `${k}`
        ],
        correct_option: 0,
        explanation: `The antiderivative of 2x is x². Evaluating from 0 to ${k}: [x²]₀^${k} = (${k})² - (0)² = ${intVal}.`,
        source: 'ai_generated'
    });
    // 8. System of Linear Equations
    const xVal = Math.floor(Math.random() * 5) + 3;
    const yVal = Math.floor(Math.random() * 4) + 1;
    const sumEq = xVal + yVal;
    const diffEq = xVal - yVal;
    problems.push({
        subject: subject || 'Algebra',
        difficulty: diff,
        question_text: `Solve the system of equations: x + y = ${sumEq} and x - y = ${diffEq}. What is the value of x?`,
        options: [
            `x = ${xVal}`,
            `x = ${yVal}`,
            `x = ${sumEq}`,
            `x = ${xVal + 2}`
        ],
        correct_option: 0,
        explanation: `Adding both equations: (x + y) + (x - y) = ${sumEq} + ${diffEq} => 2x = ${sumEq + diffEq} => x = ${xVal}.`,
        source: 'ai_generated'
    });
    // 9. Limits
    problems.push({
        subject: subject || 'Calculus',
        difficulty: diff,
        question_text: `What is the value of the limit lim (x → 3) of (x² - 9) / (x - 3)?`,
        options: [
            `6`,
            `3`,
            `0`,
            `Undefined`
        ],
        correct_option: 0,
        explanation: `Factor the numerator: (x² - 9) = (x - 3)(x + 3). Cancelling (x - 3): lim (x → 3) (x + 3) = 3 + 3 = 6.`,
        source: 'ai_generated'
    });
    // 10. Pythagorean Theorem Geometry Problem
    problems.push({
        subject: subject || 'Mathematics',
        difficulty: diff,
        question_text: `In a right-angled triangle, the lengths of the two legs are 6 cm and 8 cm. What is the length of the hypotenuse?`,
        options: [
            `10 cm`,
            `14 cm`,
            `12 cm`,
            `48 cm`
        ],
        correct_option: 0,
        explanation: `By the Pythagorean Theorem: c² = a² + b² = 6² + 8² = 36 + 64 = 100. So hypotenuse c = √100 = 10 cm.`,
        source: 'ai_generated'
    });
    return problems;
}
// Physics Numerical Problems Generator
function generatePhysicsProblems(diff) {
    const problems = [];
    // 1. Force: F = ma
    const m = Math.floor(Math.random() * 5) + 2; // 2 to 6 kg
    const a = Math.floor(Math.random() * 4) + 2; // 2 to 5 m/s^2
    const f = m * a;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A cart with a mass of ${m} kg accelerates at ${a} m/s² on a frictionless track. What is the net force acting on the cart?`,
        options: [
            `${f} N`,
            `${m + a} N`,
            `${f * 2} N`,
            `${f - a} N`
        ],
        correct_option: 0,
        explanation: `Using Newton's Second Law of Motion: Force = mass × acceleration (F = m × a) = ${m} kg × ${a} m/s² = ${f} N.`,
        source: 'ai_generated'
    });
    // 2. Kinetic Energy: KE = 0.5 * m * v^2
    const massKg = (Math.floor(Math.random() * 4) + 1) * 2; // 2, 4, 6, 8 kg
    const velocity = Math.floor(Math.random() * 3) + 3; // 3, 4, 5 m/s
    const ke = 0.5 * massKg * velocity * velocity;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `An object of mass ${massKg} kg is moving with a constant velocity of ${velocity} m/s. What is its kinetic energy?`,
        options: [
            `${ke} Joules`,
            `${massKg * velocity} Joules`,
            `${ke * 2} Joules`,
            `${ke + 10} Joules`
        ],
        correct_option: 0,
        explanation: `Kinetic Energy formula is KE = ½ × m × v² = 0.5 × ${massKg} × (${velocity})² = 0.5 × ${massKg} × ${velocity * velocity} = ${ke} Joules.`,
        source: 'ai_generated'
    });
    // 3. Ohm's Law: V = IR => I = V / R
    const rOhms = Math.floor(Math.random() * 5) + 5; // 5 to 9 ohms
    const iAmps = Math.floor(Math.random() * 4) + 2; // 2 to 5 amps
    const vVolts = rOhms * iAmps;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `An electric circuit has a voltage of ${vVolts} V applied across a resistor of ${rOhms} Ω. What is the current flowing through the circuit?`,
        options: [
            `${iAmps} A`,
            `${vVolts - rOhms} A`,
            `${vVolts * rOhms} A`,
            `${iAmps + 2} A`
        ],
        correct_option: 0,
        explanation: `Using Ohm's Law: Current I = V / R = ${vVolts} V / ${rOhms} Ω = ${iAmps} Amperes.`,
        source: 'ai_generated'
    });
    // 4. Wave Speed: v = f * lambda
    const freq = 50;
    const lambda = Math.floor(Math.random() * 4) + 2; // 2 to 5 m
    const speed = freq * lambda;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A sound wave has a frequency of ${freq} Hz and a wavelength of ${lambda} meters. What is the propagation speed of the wave?`,
        options: [
            `${speed} m/s`,
            `${freq / lambda} m/s`,
            `${speed / 2} m/s`,
            `${freq + lambda} m/s`
        ],
        correct_option: 0,
        explanation: `Wave speed formula is v = frequency × wavelength (v = f × λ) = ${freq} Hz × ${lambda} m = ${speed} m/s.`,
        source: 'ai_generated'
    });
    // 5. Work Done: W = F * d
    const forceN = Math.floor(Math.random() * 15) + 10;
    const distM = Math.floor(Math.random() * 5) + 2;
    const workJ = forceN * distM;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A person pushes a box with a constant horizontal force of ${forceN} N over a distance of ${distM} meters. How much work is done?`,
        options: [
            `${workJ} Joules`,
            `${forceN + distM} Joules`,
            `${workJ * 2} Joules`,
            `${forceN} Joules`
        ],
        correct_option: 0,
        explanation: `Work = Force × distance (W = F × d) = ${forceN} N × ${distM} m = ${workJ} Joules.`,
        source: 'ai_generated'
    });
    // 6. Gravitational Potential Energy: PE = mgh (g = 9.8)
    const peMass = 5;
    const peHeight = 10;
    const peJoules = peMass * 9.8 * peHeight;
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A 5 kg stone is raised to a height of 10 meters above the ground (taking g = 9.8 m/s²). What is its gravitational potential energy?`,
        options: [
            `${peJoules} Joules`,
            `50 Joules`,
            `49 Joules`,
            `100 Joules`
        ],
        correct_option: 0,
        explanation: `Gravitational Potential Energy PE = m × g × h = 5 kg × 9.8 m/s² × 10 m = 490 Joules.`,
        source: 'ai_generated'
    });
    // 7. Average Speed
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A train travels a distance of 360 km in 4 hours at constant speed. What is the average speed of the train?`,
        options: [
            `90 km/h`,
            `80 km/h`,
            `100 km/h`,
            `75 km/h`
        ],
        correct_option: 0,
        explanation: `Speed = Distance / Time = 360 km / 4 hours = 90 km/h.`,
        source: 'ai_generated'
    });
    // 8. Momentum: p = mv
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A football of mass 0.5 kg is kicked with a velocity of 20 m/s. What is its linear momentum?`,
        options: [
            `10 kg·m/s`,
            `40 kg·m/s`,
            `20.5 kg·m/s`,
            `5 kg·m/s`
        ],
        correct_option: 0,
        explanation: `Momentum p = mass × velocity = 0.5 kg × 20 m/s = 10 kg·m/s.`,
        source: 'ai_generated'
    });
    // 9. Electric Power: P = V * I
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `An electric lightbulb operates on 220 V and draws a current of 0.5 A. What is the electrical power rating of the bulb?`,
        options: [
            `110 Watts`,
            `220 Watts`,
            `440 Watts`,
            `55 Watts`
        ],
        correct_option: 0,
        explanation: `Electric Power P = Voltage × Current (P = V × I) = 220 V × 0.5 A = 110 Watts.`,
        source: 'ai_generated'
    });
    // 10. Density
    problems.push({
        subject: 'Physics',
        difficulty: diff,
        question_text: `A solid aluminum block has a mass of 270 g and a volume of 100 cm³. What is its density?`,
        options: [
            `2.7 g/cm³`,
            `27 g/cm³`,
            `0.27 g/cm³`,
            `3.7 g/cm³`
        ],
        correct_option: 0,
        explanation: `Density = Mass / Volume = 270 g / 100 cm³ = 2.7 g/cm³.`,
        source: 'ai_generated'
    });
    return problems;
}
// Chemistry Numerical Problems Generator
function generateChemistryProblems(diff) {
    const problems = [];
    // 1. Molar Mass of Compounds
    const compounds = [
        { name: 'Water (H₂O)', formula: '2(1) + 16', mass: 18, details: 'H = 1 g/mol, O = 16 g/mol' },
        { name: 'Carbon Dioxide (CO₂)', formula: '12 + 2(16)', mass: 44, details: 'C = 12 g/mol, O = 16 g/mol' },
        { name: 'Methane (CH₄)', formula: '12 + 4(1)', mass: 16, details: 'C = 12 g/mol, H = 1 g/mol' },
        { name: 'Sulfuric Acid (H₂SO₄)', formula: '2(1) + 32 + 4(16)', mass: 98, details: 'H = 1, S = 32, O = 16 g/mol' },
        { name: 'Sodium Chloride (NaCl)', formula: '23 + 35.5', mass: 58.5, details: 'Na = 23 g/mol, Cl = 35.5 g/mol' }
    ];
    compounds.forEach((comp) => {
        problems.push({
            subject: 'Chemistry',
            difficulty: diff,
            question_text: `What is the molar mass of ${comp.name}? (Given atomic masses: ${comp.details})`,
            options: [
                `${comp.mass} g/mol`,
                `${comp.mass + 6} g/mol`,
                `${comp.mass - 4} g/mol`,
                `${comp.mass * 2} g/mol`
            ],
            correct_option: 0,
            explanation: `Molar mass of ${comp.name} is calculated by summing the atomic masses: ${comp.formula} = ${comp.mass} g/mol.`,
            source: 'ai_generated'
        });
    });
    // 2. pH Calculation: pH = -log[H+]
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `If an aqueous solution has a hydrogen ion concentration [H⁺] of 1.0 × 10⁻⁴ M, what is the pH of the solution?`,
        options: [
            `4.0`,
            `10.0`,
            `1.4`,
            `7.0`
        ],
        correct_option: 0,
        explanation: `pH is defined as the negative logarithm of the hydrogen ion concentration: pH = -log₁₀[H⁺] = -log₁₀(10⁻⁴) = 4.0.`,
        source: 'ai_generated'
    });
    // 3. Density: D = M / V
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `A sample of an unknown metal has a mass of 120 g and occupies a volume of 40 cm³. What is the density of the metal?`,
        options: [
            `3.0 g/cm³`,
            `4.5 g/cm³`,
            `6.0 g/cm³`,
            `80 g/cm³`
        ],
        correct_option: 0,
        explanation: `Density is calculated as mass divided by volume: Density D = Mass / Volume = 120 g / 40 cm³ = 3.0 g/cm³.`,
        source: 'ai_generated'
    });
    // 4. Moles calculation: n = mass / molar mass
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `How many moles are present in 36 grams of pure water (H₂O)? (Molar mass of H₂O = 18 g/mol)`,
        options: [
            `2 moles`,
            `1 mole`,
            `3 moles`,
            `0.5 moles`
        ],
        correct_option: 0,
        explanation: `Number of moles n = Mass / Molar Mass = 36 g / 18 g/mol = 2 moles.`,
        source: 'ai_generated'
    });
    // 5. Boyle's Law: P1V1 = P2V2
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `A gas sample occupies 4.0 liters at a pressure of 1.0 atm. If the pressure is increased to 2.0 atm at constant temperature, what is the new volume? (Boyle's Law)`,
        options: [
            `2.0 liters`,
            `8.0 liters`,
            `4.0 liters`,
            `1.0 liter`
        ],
        correct_option: 0,
        explanation: `According to Boyle's Law: P₁ × V₁ = P₂ × V₂. Substituting: (1.0 atm) × (4.0 L) = (2.0 atm) × V₂ => V₂ = 4.0 / 2.0 = 2.0 liters.`,
        source: 'ai_generated'
    });
    // 6. Avogadro's Number
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `How many atoms or molecules are present in exactly one mole of any pure substance (Avogadro's constant)?`,
        options: [
            `6.022 × 10²³`,
            `3.00 × 10⁸`,
            `1.602 × 10⁻¹⁹`,
            `9.8 × 10²`
        ],
        correct_option: 0,
        explanation: `Avogadro's constant defines that one mole contains exactly 6.022 × 10²³ elementary entities.`,
        source: 'ai_generated'
    });
    // 7. Valence electrons
    problems.push({
        subject: 'Chemistry',
        difficulty: diff,
        question_text: `How many valence electrons does a neutral Carbon atom have in its outermost shell? (Atomic number = 6)`,
        options: [
            `4`,
            `2`,
            `6`,
            `8`
        ],
        correct_option: 0,
        explanation: `Carbon has electron configuration 1s² 2s² 2p², which gives 2 + 2 = 4 valence electrons in outer shell n=2.`,
        source: 'ai_generated'
    });
    return problems;
}
/**
 * Domain-specific question banks across all subjects and difficulty levels.
 * EASY questions are strictly simple, beginner-friendly, and practical (no complex architectural jargon).
 */
const dynamicTopicGenerators = {
    // HTML
    'HTML': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'HTML', difficulty: 'easy', question_text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management Links', 'Home Tool Markup Language'], correct_option: 0, explanation: 'HTML stands for Hyper Text Markup Language. It is the standard language for creating web pages.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag is used to create a hyperlink to another page?', options: ['<a>', '<link>', '<href>', '<hyperlink>'], correct_option: 0, explanation: 'The <a> (anchor) tag defines a hyperlink that links to other pages or files.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which tag is used to display an image on a webpage?', options: ['<img>', '<image>', '<pic>', '<src>'], correct_option: 0, explanation: 'The <img> tag embeds an image in an HTML document.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML element represents the largest heading?', options: ['<h1>', '<h6>', '<heading>', '<head>'], correct_option: 0, explanation: '<h1> defines the highest level and largest heading in HTML.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'What is the correct HTML element for inserting a line break?', options: ['<br>', '<lb>', '<break>', '<newline>'], correct_option: 0, explanation: '<br> inserts a simple line break without starting a new paragraph.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which attribute specifies an alternate text for an image if it cannot be loaded?', options: ['alt', 'title', 'src', 'description'], correct_option: 0, explanation: 'The alt attribute provides alternate text for screen readers or when images fail to load.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag is used to create a bulleted (unordered) list?', options: ['<ul>', '<ol>', '<li>', '<list>'], correct_option: 0, explanation: '<ul> defines an unordered, bulleted list of items.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag defines a table row?', options: ['<tr>', '<td>', '<th>', '<table>'], correct_option: 0, explanation: '<tr> defines a row of cells in an HTML table.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'What is the correct HTML tag for creating a paragraph of text?', options: ['<p>', '<para>', '<text>', '<pg>'], correct_option: 0, explanation: '<p> defines a paragraph block in an HTML document.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which tag defines the title shown on the browser tab?', options: ['<title>', '<head>', '<meta>', '<header>'], correct_option: 0, explanation: '<title> sets the title shown on browser window tabs and bookmarks.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'What is the standard file extension for an HTML file?', options: ['.html', '.htmldoc', '.web', '.hypertext'], correct_option: 0, explanation: 'HTML documents are saved with the .html (or .htm) extension.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag creates a dropdown selection box in a form?', options: ['<select>', '<dropdown>', '<input type="dropdown">', '<box>'], correct_option: 0, explanation: '<select> creates a dropdown list containing <option> tags.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which tag is used to make text bold in HTML?', options: ['<b> or <strong>', '<bold>', '<dark>', '<fat>'], correct_option: 0, explanation: '<b> and <strong> make text bold in HTML documents.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Where in an HTML document should external JavaScript files or inline `<script>` tags usually be linked?', options: ['Inside <head> or at the bottom of <body>', 'Inside <table> only', 'Inside <title>', 'Outside the <html> tag'], correct_option: 0, explanation: 'Scripts are typically included in <head> or right before closing </body>.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML element is used to define an input field for forms?', options: ['<input>', '<textfield>', '<entry>', '<userinput>'], correct_option: 0, explanation: '<input> is the standard element for user data entry in forms.', source: 'ai_generated' }
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'HTML', difficulty: 'medium', question_text: 'What is the purpose of the `<meta charset="UTF-8">` tag?', options: ['Specifies the character encoding for the HTML document', 'Links external stylesheets', 'Declares the viewport dimensions', 'Enables JavaScript strict mode'], correct_option: 0, explanation: 'It specifies UTF-8 encoding covering almost all characters and symbols globally.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'medium', question_text: 'In HTML5, which tag is used to specify independent, self-contained content such as a blog post or news story?', options: ['<article>', '<section>', '<aside>', '<div>'], correct_option: 0, explanation: '<article> is intended for self-contained syndicatable content.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'medium', question_text: 'Which HTML5 input type automatically validates that the user enters an email address?', options: ['<input type="email">', '<input type="mail">', '<input type="text" validate="email">', '<input type="address">'], correct_option: 0, explanation: 'type="email" automatically checks for standard email format on form submission.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'medium', question_text: 'What is the purpose of the `<canvas>` element in HTML5?', options: ['Draws 2D graphics and animations dynamically via JavaScript', 'Displays database tables', 'Embeds vector audio files', 'Applies CSS styles globally'], correct_option: 0, explanation: '<canvas> provides a container for scriptable graphics rendering.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'HTML', difficulty: 'difficult', question_text: 'What difference exists between the `defer` and `async` attributes when loading external `<script>` tags?', options: ['defer preserves script execution order and runs after DOM parsing; async executes immediately upon download', 'async preserves script order while defer does not', 'defer executes before HTML parsing starts', 'async blocks the HTML parser during entire file download'], correct_option: 0, explanation: 'defer downloads in parallel and executes in order after DOM parsing finishes.', source: 'ai_generated' },
                { subject: 'HTML', difficulty: 'difficult', question_text: 'In the HTML Living Standard, what is the significance of the `rel="noopener noreferrer"` attribute on external links with `target="_blank"`?', options: ['Prevents the newly opened tab from accessing window.opener to protect against tabnabbing phishing', 'Speeds up server DNS lookup time', 'Enforces strict CORS header verification', 'Compresses image assets transferred over HTTP/2'], correct_option: 0, explanation: 'noopener ensures window.opener is null, preventing reverse tabnabbing attacks.', source: 'ai_generated' },
            ];
        }
    },
    // CSS
    'CSS': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'CSS', difficulty: 'easy', question_text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Styling Syntax', 'Common Sheet Styles'], correct_option: 0, explanation: 'CSS stands for Cascading Style Sheets.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property is used to change the text color?', options: ['color', 'text-color', 'font-color', 'style-color'], correct_option: 0, explanation: 'The color property sets the foreground color of text.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property is used to change the background color of an element?', options: ['background-color', 'bgcolor', 'fill-color', 'color-background'], correct_option: 0, explanation: 'background-color sets the background color of an element.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'How do you select an element with class "card" in CSS?', options: ['.card', '#card', 'card', '*card'], correct_option: 0, explanation: 'In CSS, classes are selected with a period (.card).', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'How do you select an element with id "navbar" in CSS?', options: ['#navbar', '.navbar', 'navbar', '&navbar'], correct_option: 0, explanation: 'In CSS, IDs are selected with a hash (#navbar).', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which property controls the size of text in CSS?', options: ['font-size', 'text-size', 'font-scale', 'size'], correct_option: 0, explanation: 'font-size sets the size of the font (e.g. 16px, 1.2rem).', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which property adds space INSIDE an element’s border?', options: ['padding', 'margin', 'spacing', 'gap'], correct_option: 0, explanation: 'Padding adds space inside the border; margin adds space outside.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which property adds space OUTSIDE an element’s border?', options: ['margin', 'padding', 'outline', 'border-space'], correct_option: 0, explanation: 'Margin creates space around elements outside any defined borders.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property makes text bold?', options: ['font-weight', 'font-bold', 'text-weight', 'style-bold'], correct_option: 0, explanation: 'font-weight: bold or 700 makes text bold.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property is used to align text to the center?', options: ['text-align: center', 'align: middle', 'text-center: true', 'horizontal-align: center'], correct_option: 0, explanation: 'text-align: center aligns text horizontally in the middle.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'How do you write a comment in CSS?', options: ['/* this is a comment */', '// this is a comment', '# this is a comment', '<!-- this is a comment -->'], correct_option: 0, explanation: 'CSS comments start with /* and end with */.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property completely hides an element from the page layout?', options: ['display: none', 'visibility: visible', 'opacity: 1', 'hidden: true'], correct_option: 0, explanation: 'display: none removes the element from the document layout entirely.', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'CSS', difficulty: 'medium', question_text: 'What does the CSS property `box-sizing: border-box` do?', options: ['Includes padding and border within the element’s total width and height', 'Excludes padding from the total dimensions', 'Adds an automatic drop shadow', 'Forces margin collapsing'], correct_option: 0, explanation: 'border-box makes width and height calculations include padding and border.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'medium', question_text: 'In Flexbox, which property aligns items along the cross axis?', options: ['align-items', 'justify-content', 'flex-direction', 'align-content'], correct_option: 0, explanation: 'align-items defines default alignment along cross axis.', source: 'ai_generated' },
                { subject: 'CSS', difficulty: 'medium', question_text: 'In Flexbox, which property aligns items along the main axis?', options: ['justify-content', 'align-items', 'flex-wrap', 'order'], correct_option: 0, explanation: 'justify-content aligns child items along the main axis.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'CSS', difficulty: 'difficult', question_text: 'What is the specificity value of selector `div.nav ul li.active a:hover`?', options: ['0, 0, 3, 4', '0, 0, 4, 3', '0, 1, 2, 3', '0, 0, 2, 5'], correct_option: 0, explanation: 'Classes/pseudo-classes (.nav, .active, :hover) = 3; Elements (div, ul, li, a) = 4 => (0, 0, 3, 4).', source: 'ai_generated' },
            ];
        }
    },
    // JavaScript
    'JavaScript': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which keyword is used to declare a variable whose value CANNOT be reassigned?', options: ['const', 'var', 'let', 'static'], correct_option: 0, explanation: 'const creates a read-only, block-scoped constant variable.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which keyword declares a re-assignable block-scoped variable in modern JavaScript?', options: ['let', 'var', 'define', 'set'], correct_option: 0, explanation: 'let declares a variable that can be updated within its block scope.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'How do you output a message to the browser console for debugging?', options: ['console.log("Hello")', 'print("Hello")', 'echo("Hello")', 'browser.output("Hello")'], correct_option: 0, explanation: 'console.log() prints messages and objects into the developer console.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which symbol is used for single-line comments in JavaScript?', options: ['//', '#', '/*', '<!--'], correct_option: 0, explanation: '// starts a single-line comment in JavaScript.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which comparison operator checks both value AND data type for strict equality?', options: ['===', '==', '=', '!='], correct_option: 0, explanation: '=== is the strict equality operator that checks value and type without coercion.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'What data type is the value `true` in JavaScript?', options: ['boolean', 'string', 'number', 'undefined'], correct_option: 0, explanation: 'true and false belong to the boolean data type.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which array method adds one or more items to the END of an array?', options: ['.push()', '.pop()', '.shift()', '.concat()'], correct_option: 0, explanation: 'The .push() method appends elements to the end of an array.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which array method removes the LAST item from an array?', options: ['.pop()', '.shift()', '.remove()', '.delete()'], correct_option: 0, explanation: 'The .pop() method removes and returns the last element of an array.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'How do you define a function named "calculate" in JavaScript?', options: ['function calculate() {}', 'def calculate():', 'create function calculate()', 'func calculate()'], correct_option: 0, explanation: 'function functionName() {} is the standard function declaration syntax.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'What will `typeof "QuizLab"` return in JavaScript?', options: ['"string"', '"text"', '"char"', '"word"'], correct_option: 0, explanation: 'Characters wrapped in quotes are of type "string".', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'Which built-in method parses a JSON string into a JavaScript object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.objectify()', 'JSON.toObject()'], correct_option: 0, explanation: 'JSON.parse() parses a JSON string into a JavaScript value or object.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'easy', question_text: 'What is the correct file extension for JavaScript files?', options: ['.js', '.javascript', '.script', '.jsxonly'], correct_option: 0, explanation: 'Standard JavaScript files have the .js extension.', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'JavaScript', difficulty: 'medium', question_text: 'What is the output of `[] + []` in JavaScript?', options: ['"" (empty string)', '[]', 'undefined', 'NaN'], correct_option: 0, explanation: 'The plus operator coerces both empty arrays to empty strings and concatenates them.', source: 'ai_generated' },
                { subject: 'JavaScript', difficulty: 'medium', question_text: 'What is the primary role of the JavaScript Event Loop?', options: ['Monitors Call Stack and Task Queue to push asynchronous callbacks when stack is empty', 'Compiles JavaScript directly to bytecode', 'Allocates heap memory for garbage collection', 'Synchronizes DOM repaint cycles'], correct_option: 0, explanation: 'Event loop continuously coordinates call stack and callback task queue.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'JavaScript', difficulty: 'difficult', question_text: 'In JavaScript execution context, what is the exact difference between Microtasks (e.g. Promise.then) and Macrotasks (e.g. setTimeout)?', options: ['Microtask queue is exhausted completely before processing the next macrotask', 'Macrotasks always execute before microtasks', 'Microtasks run on a separate OS thread', 'Macrotasks bypass the Call Stack'], correct_option: 0, explanation: 'All queued microtasks run to completion at end of current task before next macrotask starts.', source: 'ai_generated' },
            ];
        }
    },
    // Python
    'Python': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'Python', difficulty: 'easy', question_text: 'How do you print text to the screen in Python?', options: ['print("Hello")', 'echo("Hello")', 'System.out.println("Hello")', 'console.log("Hello")'], correct_option: 0, explanation: 'print() is Python’s built-in function to display output.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which symbol is used for single-line comments in Python?', options: ['#', '//', '/*', '--'], correct_option: 0, explanation: '# denotes single-line comments in Python.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'What is the correct file extension for Python files?', options: ['.py', '.python', '.pyt', '.pt'], correct_option: 0, explanation: 'Python source code files use the .py extension.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which keyword is used to define a function in Python?', options: ['def', 'function', 'fun', 'define'], correct_option: 0, explanation: 'def is used to define a function in Python.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which Python data type represents an immutable sequence of items?', options: ['tuple', 'list', 'dictionary', 'set'], correct_option: 0, explanation: 'Tuples cannot be modified after creation, making them immutable.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which built-in function returns the number of items in a list or string in Python?', options: ['len()', 'count()', 'size()', 'length()'], correct_option: 0, explanation: 'len() returns the length of objects such as strings and lists.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'How do you add an item to the end of a list in Python?', options: ['my_list.append(x)', 'my_list.add(x)', 'my_list.push(x)', 'my_list.insert(x)'], correct_option: 0, explanation: '.append() adds a single element to the end of a list.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which keyword is used to import an external module in Python?', options: ['import', 'require', 'include', 'using'], correct_option: 0, explanation: 'The import keyword loads modules into Python scripts.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'What will `type(42)` return in Python?', options: ['<class \'int\'>', '<class \'number\'>', '<class \'float\'>', '<class \'digit\'>'], correct_option: 0, explanation: '42 is a whole number, so its type is int.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'Which operator is used to raise a number to a power (exponentiation) in Python?', options: ['**', '^', '^^', 'pow'], correct_option: 0, explanation: '2 ** 3 calculates 2 to the power of 3 (8).', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'easy', question_text: 'What is the correct syntax for an `if` statement in Python?', options: ['if x > 5:', 'if (x > 5) then', 'if x > 5 do:', 'if {x > 5}'], correct_option: 0, explanation: 'Python if statements end with a colon (:).', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'Python', difficulty: 'medium', question_text: 'What does the `yield` statement do in a Python function?', options: ['Converts the function into a generator that produces values lazily', 'Terminates execution permanently', 'Throws an exception', 'Locks the global interpreter'], correct_option: 0, explanation: 'yield pauses function execution and returns a generator object.', source: 'ai_generated' },
                { subject: 'Python', difficulty: 'medium', question_text: 'What does the Global Interpreter Lock (GIL) enforce in CPython?', options: ['Only one native thread executes Python bytecode at a time', 'Prevents memory leaks in circular references', 'Compiles Python to machine code', 'Enforces type annotations'], correct_option: 0, explanation: 'GIL prevents multiple threads from executing CPython bytecode simultaneously.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'Python', difficulty: 'difficult', question_text: 'In Python, what is the purpose of the `__slots__` attribute in a class definition?', options: ['Prevents dynamic creation of `__dict__` to drastically reduce memory overhead per instance', 'Enforces strict runtime type checking', 'Allows multiple inheritance from built-in types', 'Enables automatic garbage collection'], correct_option: 0, explanation: '__slots__ reserves space for declared attributes and prevents __dict__ allocation.', source: 'ai_generated' },
            ];
        }
    },
    // React.js
    'React.js': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'React.js', difficulty: 'easy', question_text: 'What is JSX in React?', options: ['A syntax extension for JavaScript that looks like HTML', 'A CSS framework', 'A database query language', 'A server routing library'], correct_option: 0, explanation: 'JSX allows writing HTML-like structures directly inside JavaScript code.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'Which React hook is used to manage local state in a functional component?', options: ['useState', 'useEffect', 'useMemo', 'useReducer'], correct_option: 0, explanation: 'useState is the primary hook used for state management in functional components.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'How do you pass data from a parent component down to a child component in React?', options: ['Via props', 'Via window variables', 'Via CSS classes', 'Via local storage'], correct_option: 0, explanation: 'Props (properties) allow unidirectional data flow from parent to child components.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'Which React hook handles side effects like fetching data or updating the document title?', options: ['useEffect', 'useState', 'useRef', 'useCallback'], correct_option: 0, explanation: 'useEffect handles lifecycle side effects in React functional components.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'What must every React component return to render UI on the screen?', options: ['JSX / React Elements', 'A SQL query', 'A void null pointer', 'A binary buffer'], correct_option: 0, explanation: 'React components return JSX representing the user interface.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'What is a key requirement for React component names?', options: ['They must begin with an uppercase letter (e.g. App, Header)', 'They must be lowercase', 'They must start with a dollar sign', 'They must contain numbers'], correct_option: 0, explanation: 'React treats components starting with lowercase letters as regular HTML DOM tags.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'Which attribute in JSX replaces the standard HTML "class" attribute?', options: ['className', 'class', 'styleClass', 'cssClass'], correct_option: 0, explanation: 'className is used in JSX because "class" is a reserved keyword in JavaScript.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'easy', question_text: 'What does the Virtual DOM in React primarily help optimize?', options: ['Minimizes expensive real browser DOM manipulations by comparing changes first', 'Compresses network download speed', 'Converts JavaScript to machine bytecode', 'Replaces relational database queries'], correct_option: 0, explanation: 'The Virtual DOM calculates minimal diffs before updating real browser DOM.', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'React.js', difficulty: 'medium', question_text: 'What is the purpose of the dependency array in `useEffect`?', options: ['Controls when the effect hook re-runs based on value changes', 'Defines child components', 'Imports third-party CSS modules', 'Enables server-side rendering'], correct_option: 0, explanation: 'React only re-executes the effect if any dependency value changes between renders.', source: 'ai_generated' },
                { subject: 'React.js', difficulty: 'medium', question_text: 'Why should unique `key` props be provided when rendering lists in React?', options: ['Helps React identify which list items were added, changed, or removed during diffing', 'Applies CSS grid styling', 'Required by JavaScript arrays', 'Enables automatic scrolling'], correct_option: 0, explanation: 'Keys give list elements a stable identity across render passes for virtual DOM reconciliation.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'React.js', difficulty: 'difficult', question_text: 'How does React 18 Fiber architecture achieve Concurrent rendering?', options: ['By breaking rendering work into interruptible units of work with priority scheduling', 'By running multiple virtual DOMs in parallel Web Workers', 'By replacing JavaScript with WebAssembly', 'By using native DOM diffing engines'], correct_option: 0, explanation: 'Fiber divides component tree updates into interruptible units prioritizing urgent user interactions.', source: 'ai_generated' },
            ];
        }
    },
    // DSA
    'DSA': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'DSA', difficulty: 'easy', question_text: 'Which data structure follows the First-In-First-Out (FIFO) principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correct_option: 0, explanation: 'A Queue processes elements in First-In-First-Out order (like a line at a store).', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?', options: ['Stack', 'Queue', 'Array', 'Linked List'], correct_option: 0, explanation: 'A Stack processes items in Last-In-First-Out order (like a stack of plates).', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'What is the index of the first element in an array in most programming languages?', options: ['0', '1', '-1', 'null'], correct_option: 0, explanation: 'Zero-based indexing is standard in languages like C, Java, Python, and JavaScript.', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'What is the time complexity to access an element by its index in an array?', options: ['O(1) constant time', 'O(n) linear time', 'O(log n)', 'O(n^2)'], correct_option: 0, explanation: 'Array index access is instantaneous O(1) via direct memory pointer offsets.', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'What data structure consists of nodes where each node stores data and a link to the next node?', options: ['Linked List', 'Array', 'Binary Heap', 'Matrix'], correct_option: 0, explanation: 'A Singly Linked List connects sequential nodes through reference pointers.', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'Which operation inserts an element onto the top of a Stack?', options: ['push', 'pop', 'enqueue', 'dequeue'], correct_option: 0, explanation: 'push adds an element to the top of a stack; pop removes it.', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'Which operation removes an element from the front of a Queue?', options: ['dequeue', 'enqueue', 'push', 'pop'], correct_option: 0, explanation: 'dequeue removes the item from the front of a queue; enqueue inserts at the rear.', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'easy', question_text: 'What is a tree node with no children called?', options: ['Leaf node', 'Root node', 'Branch node', 'Internal node'], correct_option: 0, explanation: 'A node with zero child nodes is known as a leaf node.', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'DSA', difficulty: 'medium', question_text: 'What is the average time complexity of searching in a balanced Binary Search Tree (BST)?', options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], correct_option: 0, explanation: 'A balanced BST halves the search space at each step, yielding O(log n).', source: 'ai_generated' },
                { subject: 'DSA', difficulty: 'medium', question_text: 'Which sorting algorithm has average O(n log n) complexity but degrades to O(n^2) in worst case?', options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'], correct_option: 0, explanation: 'Quick Sort is O(n^2) when chosen pivot yields maximally unbalanced partitions.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'DSA', difficulty: 'difficult', question_text: 'What is the amortized time complexity of inserting an element into a Fibonacci Heap?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct_option: 0, explanation: 'Fibonacci Heaps achieve O(1) amortized insertion by delaying tree consolidation.', source: 'ai_generated' },
            ];
        }
    },
    // DBMS
    'DBMS': (diff) => {
        if (diff === 'easy') {
            return [
                { subject: 'DBMS', difficulty: 'easy', question_text: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Question Language', 'Standard Quick Logic', 'Sequential Query Loop'], correct_option: 0, explanation: 'SQL stands for Structured Query Language.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which SQL keyword is used to retrieve data from a database table?', options: ['SELECT', 'GET', 'RETRIEVE', 'FETCH'], correct_option: 0, explanation: 'SELECT is the fundamental SQL statement used to query and read data.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which SQL clause is used to filter rows based on a specific condition?', options: ['WHERE', 'ORDER BY', 'GROUP BY', 'FILTER'], correct_option: 0, explanation: 'WHERE specifies conditions that returned records must satisfy.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'What is a Primary Key in a relational database?', options: ['A column that uniquely identifies every row in a table', 'A password used to access the database', 'The first column of every table', 'An encrypted foreign identifier'], correct_option: 0, explanation: 'A primary key enforces unique identification and cannot contain NULL values.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which SQL command is used to insert new rows into a database table?', options: ['INSERT INTO', 'ADD ROW', 'PUT', 'NEW RECORD'], correct_option: 0, explanation: 'INSERT INTO adds new tuples/records into an existing table.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which SQL command is used to modify existing records in a table?', options: ['UPDATE', 'MODIFY', 'CHANGE', 'ALTER DATA'], correct_option: 0, explanation: 'UPDATE modifies data in existing table rows.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which SQL command removes records from a database table?', options: ['DELETE', 'REMOVE', 'DROP ROW', 'ERASE'], correct_option: 0, explanation: 'DELETE FROM table WHERE ... removes specific rows.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'easy', question_text: 'Which clause is used to sort the result-set in SQL?', options: ['ORDER BY', 'SORT BY', 'ARRANGE', 'GROUP BY'], correct_option: 0, explanation: 'ORDER BY sorts query results ascending (ASC) or descending (DESC).', source: 'ai_generated' },
            ];
        }
        else if (diff === 'medium') {
            return [
                { subject: 'DBMS', difficulty: 'medium', question_text: 'What is the main goal of database normalization (1NF, 2NF, 3NF)?', options: ['Eliminate data redundancy and prevent update/delete anomalies', 'Increase file size', 'Compress backups', 'Encrypt user passwords'], correct_option: 0, explanation: 'Normalization organizes relational tables to minimize data duplication and anomalies.', source: 'ai_generated' },
                { subject: 'DBMS', difficulty: 'medium', question_text: 'In relational database transactions, what does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Automated, Concurrent, Indexed, Distributed', 'Application, Client, Interface, Database', 'All, Connected, Internal, Data'], correct_option: 0, explanation: 'ACID properties ensure reliable transactional data processing.', source: 'ai_generated' },
            ];
        }
        else {
            return [
                { subject: 'DBMS', difficulty: 'difficult', question_text: 'What concurrency anomaly does Multi-Version Concurrency Control (MVCC) primarily eliminate without locking readers?', options: ['Readers blocking writers and writers blocking readers', 'Disk block corruption', 'Deadlocks in single-row updates', 'Index page splits'], correct_option: 0, explanation: 'MVCC provides point-in-time snapshots so readers never block writers.', source: 'ai_generated' },
            ];
        }
    },
    // Mathematics & Linear Algebra with Matrices & Numerical Problems
    'Linear Algebra': (diff) => generateMatrixAndMathProblems('Linear Algebra', diff),
    'Algebra': (diff) => generateMatrixAndMathProblems('Algebra', diff),
    'Calculus': (diff) => generateMatrixAndMathProblems('Calculus', diff),
    'Mathematics': (diff) => generateMatrixAndMathProblems('Mathematics', diff),
    'Probability & Statistics': (diff) => generateMatrixAndMathProblems('Probability & Statistics', diff),
    // Physics with Calculations (Force, Energy, Circuits, Waves, Work)
    'Physics': (diff) => generatePhysicsProblems(diff),
    // Chemistry with Calculations (Molar Mass, pH, Density, Gas Laws, Moles)
    'Chemistry': (diff) => generateChemistryProblems(diff),
    // General Science
    'Science': (diff) => [...generatePhysicsProblems(diff), ...generateChemistryProblems(diff)]
};
/**
 * Procedural fallback for EASY questions across ANY subject.
 * Strictly generates beginner-friendly, straightforward questions (never abstract architectural jargon).
 */
function generateEasyFallbackQuestions(subject, countNeeded) {
    const easyTemplates = [
        {
            q: `What is the primary role of ${subject} in modern technology?`,
            opts: [
                `It serves as an essential tool and standard foundation in ${subject}`,
                `It is an obsolete hardware standard from the 1970s`,
                `It is exclusively used for audio editing`,
                `It has no practical application in modern computing`
            ],
            ans: 0,
            exp: `${subject} is widely utilized as a core foundational technology in its domain.`
        },
        {
            q: `Which of the following is true regarding learning and using ${subject}?`,
            opts: [
                `Mastering the core syntax and basic rules is the first essential step in ${subject}`,
                `It requires no learning and works automatically without code`,
                `It can only be executed on supercomputers`,
                `It was officially discontinued decades ago`
            ],
            ans: 0,
            exp: `Understanding foundational syntax and standard rules is key to mastering ${subject}.`
        },
        {
            q: `Which standard practice is recommended for beginners studying ${subject}?`,
            opts: [
                `Writing clean, well-commented code and testing basic examples regularly`,
                `Memorizing entire libraries without running any practical code`,
                `Ignoring error messages and disabling debugging output`,
                `Never checking official documentation or specifications`
            ],
            ans: 0,
            exp: `Hands-on practice, testing, and reviewing documentation build strong competency in ${subject}.`
        },
        {
            q: `Why is consistent formatting and indentation important in ${subject}?`,
            opts: [
                `Improves code readability, maintainability, and prevents syntax errors`,
                `Doubles the execution speed of the hardware`,
                `Encodes the file into an encrypted binary format`,
                `Deletes unused variables automatically`
            ],
            ans: 0,
            exp: `Clean formatting and proper indentation make code easy to read, debug, and maintain.`
        },
        {
            q: `In ${subject}, what is the best way to inspect the value of a variable during learning?`,
            opts: [
                `Use standard print or logging functions to display its current value`,
                `Guess the value without running the program`,
                `Turn off the computer monitor`,
                `Delete the variable from the source file`
            ],
            ans: 0,
            exp: `Printing or logging variable values to the console is the simplest debugging tool for beginners.`
        },
        {
            q: `Which file extension or identifier is commonly associated with ${subject}?`,
            opts: [
                `Standard file naming conventions according to ${subject} language rules`,
                `Random binary extensions like .xyz123`,
                `Only executable .exe extensions`,
                `Unsaved temporary buffer names`
            ],
            ans: 0,
            exp: `Files in ${subject} follow standard conventions recognized by compilers and interpreters.`
        },
        {
            q: `What is a "syntax error" in ${subject}?`,
            opts: [
                `A mistake in the code structure or grammar that prevents the program from running`,
                `A hardware failure in the power supply`,
                `An intentional delay added to slow down execution`,
                `A successful program run that prints the correct result`
            ],
            ans: 0,
            exp: `Syntax errors happen when code violates the grammar rules of ${subject}, preventing execution.`
        },
        {
            q: `In ${subject}, why are meaningful variable and function names recommended?`,
            opts: [
                `They make code self-documenting and easier for humans to understand`,
                `The computer executes meaningful names faster than single-letter names`,
                `They are required to connect to the internet`,
                `They decrease physical memory chip temperatures`
            ],
            ans: 0,
            exp: `Descriptive names clarify what data a variable holds or what action a function performs.`
        },
        {
            q: `What does debugging mean in the context of ${subject}?`,
            opts: [
                `The process of finding, analyzing, and fixing errors or bugs in code`,
                `Cleaning physical dust off the computer keyboard`,
                `Deleting the entire project and starting from scratch`,
                `Purchasing commercial software licenses`
            ],
            ans: 0,
            exp: `Debugging is the routine practice of locating and correcting bugs in software programs.`
        },
        {
            q: `What is the benefit of breaking code into smaller functions or components in ${subject}?`,
            opts: [
                `Promotes code reusability, simplifies testing, and keeps logic organized`,
                `Increases code file size unnecessarily`,
                `Prevents anyone else from reading your work`,
                `Bypasses all software security checks`
            ],
            ans: 0,
            exp: `Modular functions keep code organized, easy to test, and reusable across a project.`
        }
    ];
    const results = [];
    for (let i = 0; i < countNeeded; i++) {
        const tmpl = easyTemplates[i % easyTemplates.length];
        results.push({
            subject,
            difficulty: 'easy',
            question_text: tmpl.q,
            options: tmpl.opts,
            correct_option: tmpl.ans,
            explanation: tmpl.exp,
            source: 'ai_generated'
        });
    }
    return results;
}
/**
 * Hybrid AI Generation: Generates new questions, saves them to database, and returns them
 */
async function generateAIQuestions(subject, difficulty, countNeeded) {
    const generated = [];
    // 1. Check if Gemini API is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        try {
            const promptDifficultyDesc = difficulty === 'easy'
                ? 'VERY EASY, beginner-friendly, straightforward multiple-choice questions testing basic definitions, tags, syntax, and fundamental concepts. DO NOT ask abstract, complex architectural, or advanced design pattern questions.'
                : difficulty === 'medium'
                    ? 'intermediate multiple-choice questions testing applied problem solving and practical rules'
                    : 'advanced theoretical and analytical questions';
            const prompt = `Generate ${countNeeded} distinct multiple-choice quiz questions on the subject "${subject}" with difficulty level "${difficulty}" (${promptDifficultyDesc}).
Format response strictly as valid JSON array with objects matching:
[{ "question_text": "...", "options": ["opt1", "opt2", "opt3", "opt4"], "correct_option": 0, "explanation": "..." }]`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                })
            });
            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        for (const item of parsed) {
                            if (item.question_text && Array.isArray(item.options) && item.options.length === 4) {
                                generated.push({
                                    subject,
                                    difficulty,
                                    question_text: item.question_text,
                                    options: item.options,
                                    correct_option: typeof item.correct_option === 'number' ? item.correct_option : 0,
                                    explanation: item.explanation || 'Verified concept explanation for ' + subject,
                                    source: 'ai_generated'
                                });
                            }
                        }
                    }
                }
            }
        }
        catch (apiErr) {
            console.warn('Gemini API call failed, falling back to algorithmic generator:', apiErr);
        }
    }
    // 2. Procedural generator check from curated subject banks
    if (generated.length < countNeeded) {
        const generator = dynamicTopicGenerators[subject];
        if (generator) {
            const candidates = generator(difficulty);
            for (const c of candidates) {
                if (generated.length >= countNeeded)
                    break;
                // Avoid duplicate question text
                if (!generated.some(g => g.question_text === c.question_text)) {
                    generated.push({
                        ...c,
                        subject,
                        difficulty,
                        question_text: `${c.question_text}`
                    });
                }
            }
        }
    }
    // 2B. Subject-specific Mathematical, Physics, or Chemistry Problem Generators
    if (generated.length < countNeeded) {
        if (subject.toLowerCase().includes('math') || subject === 'Linear Algebra' || subject === 'Algebra' || subject === 'Calculus' || subject === 'Probability & Statistics') {
            const mathProb = generateMatrixAndMathProblems(subject, difficulty);
            for (const p of mathProb) {
                if (generated.length >= countNeeded)
                    break;
                if (!generated.some(g => g.question_text === p.question_text)) {
                    generated.push(p);
                }
            }
        }
        else if (subject.toLowerCase().includes('physic')) {
            const physProb = generatePhysicsProblems(difficulty);
            for (const p of physProb) {
                if (generated.length >= countNeeded)
                    break;
                if (!generated.some(g => g.question_text === p.question_text)) {
                    generated.push(p);
                }
            }
        }
        else if (subject.toLowerCase().includes('chem')) {
            const chemProb = generateChemistryProblems(difficulty);
            for (const p of chemProb) {
                if (generated.length >= countNeeded)
                    break;
                if (!generated.some(g => g.question_text === p.question_text)) {
                    generated.push(p);
                }
            }
        }
    }
    // 3. Fallback synthesizer if more questions are needed
    if (generated.length < countNeeded) {
        const needed = countNeeded - generated.length;
        if (difficulty === 'easy') {
            // Use STRICTLY EASY beginner templates for easy difficulty
            const easyFallbacks = generateEasyFallbackQuestions(subject, needed);
            generated.push(...easyFallbacks);
        }
        else {
            // For medium and difficult, use intermediate conceptual archetypes
            const diffUpper = difficulty.toUpperCase();
            let index = 0;
            while (generated.length < countNeeded) {
                const salt = Math.floor(Math.random() * 9000) + 1000;
                generated.push({
                    subject,
                    difficulty,
                    question_text: `[${subject} · ${diffUpper} Level] Which of the following statements represents the standard best practice in ${subject}? (#${salt})`,
                    options: [
                        `Utilize targeted, modular patterns and verify core rules for ${subject}`,
                        `Deprecated legacy syntax superseded in recent releases`,
                        `Alternative configuration causing unintended performance degradation`,
                        `Strict anti-pattern rejected by modern ${subject} guidelines`
                    ],
                    correct_option: 0,
                    explanation: `Standard best practice established for ${subject} under ${difficulty} level conditions.`,
                    source: 'ai_generated'
                });
                index++;
            }
        }
    }
    // 4. Persist new questions to database so bank grows perpetually
    const savedQuestions = [];
    for (const q of generated) {
        try {
            const res = await (0, index_js_1.query)(`INSERT INTO questions (subject, difficulty, question_text, options, correct_option, explanation, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, subject, difficulty, question_text, options, correct_option, explanation, source`, [q.subject, q.difficulty, q.question_text, JSON.stringify(q.options), q.correct_option, q.explanation, q.source]);
            if (res.rows[0]) {
                savedQuestions.push({
                    ...res.rows[0],
                    options: typeof res.rows[0].options === 'string' ? JSON.parse(res.rows[0].options) : res.rows[0].options
                });
            }
        }
        catch {
            savedQuestions.push({
                ...q,
                id: 'gen-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
            });
        }
    }
    return savedQuestions;
}
