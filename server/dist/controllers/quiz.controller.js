"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_DIFFICULTIES = exports.AVAILABLE_SUBJECTS = exports.CATEGORIES_WITH_SUBJECTS = void 0;
exports.getQuizMeta = getQuizMeta;
exports.startQuiz = startQuiz;
exports.reattemptQuiz = reattemptQuiz;
exports.submitQuiz = submitQuiz;
exports.getQuizHistory = getQuizHistory;
exports.getQuizAnalytics = getQuizAnalytics;
exports.getAttemptReview = getAttemptReview;
const index_js_1 = require("../db/index.js");
const aiQuestionGenerator_js_1 = require("../services/aiQuestionGenerator.js");
// In-memory fallbacks when Neon DB connection is pending
const mockQuestionsBank = [
    // HTML (Easy)
    { id: 'html-e1', subject: 'HTML', difficulty: 'easy', question_text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management Links', 'Home Tool Markup Language'], correct_option: 0, explanation: 'HTML stands for Hyper Text Markup Language. It is used to structure web pages.', source: 'curated' },
    { id: 'html-e2', subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag is used to create a hyperlink to another page?', options: ['<a>', '<link>', '<href>', '<hyperlink>'], correct_option: 0, explanation: 'The <a> (anchor) tag creates links to web pages and files.', source: 'curated' },
    { id: 'html-e3', subject: 'HTML', difficulty: 'easy', question_text: 'Which tag is used to display an image on a webpage?', options: ['<img>', '<image>', '<pic>', '<src>'], correct_option: 0, explanation: '<img> inserts images into an HTML document.', source: 'curated' },
    { id: 'html-e4', subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML element represents the largest heading?', options: ['<h1>', '<h6>', '<heading>', '<head>'], correct_option: 0, explanation: '<h1> defines the top-level, largest heading.', source: 'curated' },
    { id: 'html-e5', subject: 'HTML', difficulty: 'easy', question_text: 'What is the correct HTML element for inserting a line break?', options: ['<br>', '<lb>', '<break>', '<newline>'], correct_option: 0, explanation: '<br> inserts a single line break in text.', source: 'curated' },
    { id: 'html-e6', subject: 'HTML', difficulty: 'easy', question_text: 'Which attribute specifies an alternate text for an image if it cannot be loaded?', options: ['alt', 'title', 'src', 'desc'], correct_option: 0, explanation: 'alt provides text for screen readers or broken image links.', source: 'curated' },
    { id: 'html-e7', subject: 'HTML', difficulty: 'easy', question_text: 'Which tag creates a bulleted (unordered) list in HTML?', options: ['<ul>', '<ol>', '<li>', '<list>'], correct_option: 0, explanation: '<ul> creates bulleted lists, and <ol> creates numbered lists.', source: 'curated' },
    { id: 'html-e8', subject: 'HTML', difficulty: 'easy', question_text: 'What is the correct tag for creating a paragraph?', options: ['<p>', '<para>', '<text>', '<pg>'], correct_option: 0, explanation: '<p> defines standard paragraph blocks.', source: 'curated' },
    { id: 'html-e9', subject: 'HTML', difficulty: 'easy', question_text: 'Which tag defines the title displayed on the browser tab?', options: ['<title>', '<head>', '<meta>', '<header>'], correct_option: 0, explanation: '<title> sets the browser window title.', source: 'curated' },
    { id: 'html-e10', subject: 'HTML', difficulty: 'easy', question_text: 'What is the standard file extension for an HTML document?', options: ['.html', '.web', '.doc', '.ht'], correct_option: 0, explanation: 'Web pages are saved with the .html extension.', source: 'curated' },
    { id: 'html-e11', subject: 'HTML', difficulty: 'easy', question_text: 'Which HTML tag creates a dropdown selection box in a form?', options: ['<select>', '<dropdown>', '<menu>', '<choice>'], correct_option: 0, explanation: '<select> creates a dropdown menu containing <option> tags.', source: 'curated' },
    { id: 'html-e12', subject: 'HTML', difficulty: 'easy', question_text: 'Which tag is used to make text bold in HTML?', options: ['<b> or <strong>', '<bold>', '<dark>', '<fat>'], correct_option: 0, explanation: '<b> and <strong> make text bold in HTML.', source: 'curated' },
    // JavaScript (Easy)
    { id: 'js-e1', subject: 'JavaScript', difficulty: 'easy', question_text: 'Which keyword declares a variable whose value cannot be reassigned?', options: ['const', 'let', 'var', 'static'], correct_option: 0, explanation: 'const creates a block-scoped constant.', source: 'curated' },
    { id: 'js-e2', subject: 'JavaScript', difficulty: 'easy', question_text: 'How do you print output to the browser developer console?', options: ['console.log()', 'print()', 'echo()', 'write()'], correct_option: 0, explanation: 'console.log() outputs messages to the browser console.', source: 'curated' },
    { id: 'js-e3', subject: 'JavaScript', difficulty: 'easy', question_text: 'Which symbol is used for single-line comments in JavaScript?', options: ['//', '#', '/*', '<!--'], correct_option: 0, explanation: '// starts a single-line comment.', source: 'curated' },
    { id: 'js-e4', subject: 'JavaScript', difficulty: 'easy', question_text: 'Which comparison operator checks both value and data type?', options: ['===', '==', '=', '!='], correct_option: 0, explanation: '=== checks strict equality without type coercion.', source: 'curated' },
    { id: 'js-e5', subject: 'JavaScript', difficulty: 'easy', question_text: 'What data type is the value `true`?', options: ['boolean', 'string', 'number', 'undefined'], correct_option: 0, explanation: 'true and false are booleans.', source: 'curated' },
    { id: 'js-e6', subject: 'JavaScript', difficulty: 'easy', question_text: 'Which method adds an item to the end of an array in JavaScript?', options: ['.push()', '.pop()', '.add()', '.insert()'], correct_option: 0, explanation: '.push() appends items to the end of an array.', source: 'curated' },
    { id: 'js-e7', subject: 'JavaScript', difficulty: 'easy', question_text: 'What will `typeof "QuizLab"` return?', options: ['"string"', '"text"', '"word"', '"char"'], correct_option: 0, explanation: 'Text values in quotes are strings.', source: 'curated' },
    { id: 'js-e8', subject: 'JavaScript', difficulty: 'easy', question_text: 'Which built-in object converts a JSON string into a JavaScript object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toObject()', 'JSON.decode()'], correct_option: 0, explanation: 'JSON.parse() deserializes JSON strings into objects.', source: 'curated' },
    // CSS (Easy)
    { id: 'css-e1', subject: 'CSS', difficulty: 'easy', question_text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Syntax', 'Common Sheet Styles'], correct_option: 0, explanation: 'CSS stands for Cascading Style Sheets.', source: 'curated' },
    { id: 'css-e2', subject: 'CSS', difficulty: 'easy', question_text: 'Which CSS property changes the text color?', options: ['color', 'text-color', 'font-color', 'style-color'], correct_option: 0, explanation: 'color sets text foreground color.', source: 'curated' },
    { id: 'css-e3', subject: 'CSS', difficulty: 'easy', question_text: 'How do you select an element with class name "button" in CSS?', options: ['.button', '#button', 'button', '*button'], correct_option: 0, explanation: 'Classes start with a dot (.button) in CSS selectors.', source: 'curated' },
    { id: 'css-e4', subject: 'CSS', difficulty: 'easy', question_text: 'Which property adds space INSIDE an element’s border?', options: ['padding', 'margin', 'spacing', 'gap'], correct_option: 0, explanation: 'Padding is space inside the border; margin is outside.', source: 'curated' },
    { id: 'css-e5', subject: 'CSS', difficulty: 'easy', question_text: 'Which property controls the size of text?', options: ['font-size', 'text-size', 'font-scale', 'size'], correct_option: 0, explanation: 'font-size specifies text dimensions (px, rem).', source: 'curated' },
    // Computer Science
    { id: 'cs-e1', subject: 'Computer Science', difficulty: 'easy', question_text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management Links', 'Home Tool Markup Language'], correct_option: 0, explanation: 'HTML is the standard markup language for documents designed to be displayed in a web browser.', source: 'curated' },
    { id: 'cs-e2', subject: 'Computer Science', difficulty: 'easy', question_text: 'Which data structure follows the First-In-First-Out (FIFO) principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correct_option: 0, explanation: 'A queue maintains FIFO order.', source: 'curated' },
    { id: 'cs-e3', subject: 'Computer Science', difficulty: 'easy', question_text: 'What is the primary function of RAM?', options: ['Temporary high-speed memory for active processes', 'Long-term storage', 'Graphics processing', 'Network routing'], correct_option: 0, explanation: 'RAM is volatile memory used to store active programs and data.', source: 'curated' },
    { id: 'cs-e4', subject: 'Computer Science', difficulty: 'easy', question_text: 'Which symbol denotes single-line comments in JavaScript?', options: ['//', '#', '/*', '<!--'], correct_option: 0, explanation: '// is used for single-line comments.', source: 'curated' },
    { id: 'cs-e5', subject: 'Computer Science', difficulty: 'easy', question_text: 'Which protocol securely encrypts web browsing traffic?', options: ['HTTPS', 'FTP', 'Telnet', 'SMTP'], correct_option: 0, explanation: 'HTTPS encrypts web traffic over TLS/SSL.', source: 'curated' },
    { id: 'cs-m1', subject: 'Computer Science', difficulty: 'medium', question_text: 'What is the average time complexity of searching in a balanced BST?', options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], correct_option: 0, explanation: 'A balanced BST provides logarithmic O(log n) search time.', source: 'curated' },
    { id: 'cs-m2', subject: 'Computer Science', difficulty: 'medium', question_text: 'In relational databases, what does the ACID property "I" represent?', options: ['Isolation', 'Inheritance', 'Index', 'Iteration'], correct_option: 0, explanation: 'Isolation ensures concurrent transactions do not interfere.', source: 'curated' },
    { id: 'cs-m3', subject: 'Computer Science', difficulty: 'medium', question_text: 'Which HTTP status code signifies "Unauthorized access"?', options: ['401', '403', '404', '500'], correct_option: 0, explanation: '401 Unauthorized indicates authentication is required.', source: 'curated' },
    { id: 'cs-m4', subject: 'Computer Science', difficulty: 'medium', question_text: 'What is a closure in JavaScript?', options: ['A function paired with its lexical scope environment', 'A window close event', 'A private class', 'A loop terminator'], correct_option: 0, explanation: 'Closures give functions access to outer scope variables.', source: 'curated' },
    { id: 'cs-m5', subject: 'Computer Science', difficulty: 'medium', question_text: 'Which algorithm is used to find strongly connected components in a directed graph?', options: ['Tarjan’s / Kosaraju’s algorithm', 'Dijkstra’s algorithm', 'Prim’s algorithm', 'Kruskal’s algorithm'], correct_option: 0, explanation: 'Tarjan and Kosaraju algorithms detect SCCs in O(V+E) time.', source: 'curated' },
    { id: 'cs-d1', subject: 'Computer Science', difficulty: 'difficult', question_text: 'What does the CAP theorem state is impossible to guarantee simultaneously in partitioned networks?', options: ['Consistency and Availability', 'Speed and Accuracy', 'Throughput and Durability', 'Atomicity and Isolation'], correct_option: 0, explanation: 'In network partition, a system can only guarantee C or A, not both.', source: 'curated' },
    { id: 'cs-d2', subject: 'Computer Science', difficulty: 'difficult', question_text: 'What is the purpose of the Translation Lookaside Buffer (TLB)?', options: ['Cache virtual-to-physical address mappings', 'Buffer network packets', 'Store ALU register flags', 'Cache hard drive sectors'], correct_option: 0, explanation: 'The TLB speeds up virtual memory translation.', source: 'curated' },
    { id: 'cs-d3', subject: 'Computer Science', difficulty: 'difficult', question_text: 'Which problem is established as NP-Complete?', options: ['Boolean Satisfiability (3-SAT)', 'Minimum Spanning Tree', 'Single-Source Shortest Path', 'Matrix Multiplication'], correct_option: 0, explanation: '3-SAT is a classical NP-Complete problem.', source: 'curated' },
    // Mathematics
    { id: 'm-e1', subject: 'Mathematics', difficulty: 'easy', question_text: 'What is the square root of 144?', options: ['12', '10', '14', '16'], correct_option: 0, explanation: '12 * 12 = 144.', source: 'curated' },
    { id: 'm-e2', subject: 'Mathematics', difficulty: 'easy', question_text: 'What is 7 * 8?', options: ['56', '54', '58', '64'], correct_option: 0, explanation: '7 * 8 = 56.', source: 'curated' },
    { id: 'm-e3', subject: 'Mathematics', difficulty: 'easy', question_text: 'What is the sum of interior angles in any triangle?', options: ['180 degrees', '90 degrees', '270 degrees', '360 degrees'], correct_option: 0, explanation: 'Triangle angles always sum to 180 degrees.', source: 'curated' },
    { id: 'm-e4', subject: 'Mathematics', difficulty: 'easy', question_text: 'What is 25% written as a decimal?', options: ['0.25', '0.025', '2.5', '25.0'], correct_option: 0, explanation: '25/100 = 0.25.', source: 'curated' },
    { id: 'm-e5', subject: 'Mathematics', difficulty: 'easy', question_text: 'What is the perimeter of a rectangle with length 6 and width 4?', options: ['20', '24', '10', '16'], correct_option: 0, explanation: '2 * (6 + 4) = 20.', source: 'curated' },
    { id: 'm-m1', subject: 'Mathematics', difficulty: 'medium', question_text: 'What is the derivative of f(x) = 3x^2 + 5x?', options: ['6x + 5', '3x + 5', '6x^2 + 5', '6x'], correct_option: 0, explanation: 'd/dx(3x^2 + 5x) = 6x + 5.', source: 'curated' },
    { id: 'm-m2', subject: 'Mathematics', difficulty: 'medium', question_text: 'If a fair die is rolled, what is the probability of an even number?', options: ['1/2', '1/3', '1/6', '2/3'], correct_option: 0, explanation: '{2, 4, 6} = 3 outcomes out of 6 = 1/2.', source: 'curated' },
    { id: 'm-m3', subject: 'Mathematics', difficulty: 'medium', question_text: 'Solve for x: 2^(x+1) = 32.', options: ['4', '3', '5', '6'], correct_option: 0, explanation: '32 = 2^5, so x + 1 = 5 => x = 4.', source: 'curated' },
    { id: 'm-d1', subject: 'Mathematics', difficulty: 'difficult', question_text: 'What is the limit of (sin x)/x as x approaches 0?', options: ['1', '0', 'Infinity', 'Undefined'], correct_option: 0, explanation: 'By standard limit / L’Hopital rule, limit is 1.', source: 'curated' },
    { id: 'm-d2', subject: 'Mathematics', difficulty: 'difficult', question_text: 'What is the integral of ln(x) dx?', options: ['x ln(x) - x + C', '1/x + C', 'x^2/2 + C', '(ln x)^2 + C'], correct_option: 0, explanation: 'Integration by parts gives x ln(x) - x + C.', source: 'curated' },
    // Science
    { id: 's-e1', subject: 'Science', difficulty: 'easy', question_text: 'What chemical element has the symbol "O"?', options: ['Oxygen', 'Osmium', 'Gold', 'Iron'], correct_option: 0, explanation: 'O represents Oxygen.', source: 'curated' },
    { id: 's-e2', subject: 'Science', difficulty: 'easy', question_text: 'Which planet is commonly called the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Mercury'], correct_option: 0, explanation: 'Iron oxide gives Mars its red appearance.', source: 'curated' },
    { id: 's-e3', subject: 'Science', difficulty: 'easy', question_text: 'What is known as the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'], correct_option: 0, explanation: 'Mitochondria generate ATP.', source: 'curated' },
    { id: 's-e4', subject: 'Science', difficulty: 'easy', question_text: 'At what Celsius temperature does water freeze?', options: ['0', '-10', '32', '100'], correct_option: 0, explanation: 'Water freezes at 0 degrees Celsius.', source: 'curated' },
    { id: 's-e5', subject: 'Science', difficulty: 'easy', question_text: 'What gas do plants absorb during photosynthesis?', options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Methane'], correct_option: 0, explanation: 'Plants absorb CO2 and emit O2.', source: 'curated' },
    { id: 's-m1', subject: 'Science', difficulty: 'medium', question_text: 'What is the SI unit of electrical resistance?', options: ['Ohm', 'Volt', 'Ampere', 'Watt'], correct_option: 0, explanation: 'Resistance is measured in Ohms.', source: 'curated' },
    { id: 's-m2', subject: 'Science', difficulty: 'medium', question_text: 'What is the pH of neutral pure water at 25C?', options: ['7', '5', '9', '14'], correct_option: 0, explanation: 'Neutral pH is 7.0.', source: 'curated' },
    { id: 's-m3', subject: 'Science', difficulty: 'medium', question_text: 'What organ produces insulin in humans?', options: ['Pancreas', 'Liver', 'Kidney', 'Gallbladder'], correct_option: 0, explanation: 'The pancreas produces insulin.', source: 'curated' },
    { id: 's-d1', subject: 'Science', difficulty: 'difficult', question_text: 'What fundamental force is mediated by gluons?', options: ['Strong nuclear force', 'Electromagnetic force', 'Gravity', 'Weak nuclear force'], correct_option: 0, explanation: 'Gluons mediate the strong force between quarks.', source: 'curated' },
    { id: 's-d2', subject: 'Science', difficulty: 'difficult', question_text: 'What is the half-life of Carbon-14 approximately?', options: ['5,730 years', '1,200 years', '25,000 years', '100,000 years'], correct_option: 0, explanation: 'Carbon-14 half life is ~5,730 years.', source: 'curated' }
];
const mockAttempts = new Map();
const mockAttemptQuestions = new Map();
exports.CATEGORIES_WITH_SUBJECTS = [
    {
        id: 'programming',
        name: 'Programming',
        description: 'Modern programming languages, web engineering & frameworks',
        subjects: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'HTML', 'CSS', 'React.js', 'Node.js', 'SQL']
    },
    {
        id: 'cs',
        name: 'Computer Science',
        description: 'Foundational CS, architecture, networks, and advanced theory',
        subjects: ['DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'AI & Machine Learning', 'Cyber Security']
    },
    {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Calculus, algebra, probability, and discrete mathematics',
        subjects: ['Algebra', 'Calculus', 'Probability & Statistics', 'Discrete Mathematics', 'Linear Algebra']
    },
    {
        id: 'science',
        name: 'Science',
        description: 'Physics, chemistry, biology, and natural sciences',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Astronomy']
    },
    {
        id: 'gk',
        name: 'General Knowledge',
        description: 'World history, global geography, discoveries, and culture',
        subjects: ['World History', 'Geography', 'Inventions & Discoveries', 'Literature & Arts']
    }
];
exports.AVAILABLE_SUBJECTS = exports.CATEGORIES_WITH_SUBJECTS.flatMap((c) => c.subjects);
exports.AVAILABLE_DIFFICULTIES = ['easy', 'medium', 'difficult'];
/**
 * GET /api/quiz/meta
 * Returns available categories, subjects, and difficulty levels
 */
async function getQuizMeta(_req, res) {
    res.json({
        categories: exports.CATEGORIES_WITH_SUBJECTS,
        subjects: exports.AVAILABLE_SUBJECTS,
        difficulties: exports.AVAILABLE_DIFFICULTIES,
    });
}
/**
 * POST /api/quiz/start
 * Starts a new quiz attempt with fresh, previously unused questions (Hybrid AI)
 */
async function startQuiz(req, res) {
    const userId = req.user.id;
    const { subject, difficulty } = req.body;
    if (!subject || !difficulty) {
        res.status(400).json({ error: 'Subject and difficulty are required' });
        return;
    }
    const normalizedDiff = difficulty.toLowerCase();
    const targetCount = Number(req.body.questionCount) || 10;
    try {
        // 1. Get IDs of questions already used by this user for (subject, difficulty)
        let usedQuestionIds = [];
        try {
            const usedRes = await (0, index_js_1.query)(`SELECT DISTINCT qaq.question_id 
         FROM quiz_attempt_questions qaq
         JOIN quiz_attempts qa ON qaq.attempt_id = qa.id
         WHERE qa.user_id = $1 AND qa.subject = $2 AND qa.difficulty = $3 AND qaq.question_id IS NOT NULL`, [userId, subject, normalizedDiff]);
            usedQuestionIds = usedRes.rows.map((r) => r.question_id);
        }
        catch {
            // In-memory fallback
            for (const [attId, att] of mockAttempts.entries()) {
                if (att.user_id === userId && att.subject === subject && att.difficulty === normalizedDiff) {
                    const qs = mockAttemptQuestions.get(attId) || [];
                    for (const q of qs) {
                        if (q.question_id)
                            usedQuestionIds.push(q.question_id);
                    }
                }
            }
        }
        // 2. Query unused questions from database
        let selectedQuestions = [];
        try {
            let dbRes;
            if (usedQuestionIds.length > 0) {
                dbRes = await (0, index_js_1.query)(`SELECT id, subject, difficulty, question_text, options, correct_option, explanation, source
           FROM questions
           WHERE subject = $1 AND difficulty = $2 AND id NOT IN (${usedQuestionIds.map((_, i) => `$${i + 3}`).join(',')})
           ORDER BY random()
           LIMIT $3`, [subject, normalizedDiff, targetCount, ...usedQuestionIds]);
            }
            else {
                dbRes = await (0, index_js_1.query)(`SELECT id, subject, difficulty, question_text, options, correct_option, explanation, source
           FROM questions
           WHERE subject = $1 AND difficulty = $2
           ORDER BY random()
           LIMIT $3`, [subject, normalizedDiff, targetCount]);
            }
            selectedQuestions = dbRes.rows.map((r) => ({
                ...r,
                options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
            }));
        }
        catch {
            // In-memory fallback
            const candidates = mockQuestionsBank.filter((q) => q.subject === subject && q.difficulty === normalizedDiff && !usedQuestionIds.includes(q.id));
            // Shuffle
            selectedQuestions = candidates.sort(() => 0.5 - Math.random()).slice(0, targetCount);
        }
        // 3. Hybrid AI Generation: If fewer than targetCount, generate fresh questions on-demand
        if (selectedQuestions.length < targetCount) {
            const needed = targetCount - selectedQuestions.length;
            console.log(`🤖 Generating ${needed} fresh questions via Hybrid AI for ${subject} (${normalizedDiff})...`);
            const aiQuestions = await (0, aiQuestionGenerator_js_1.generateAIQuestions)(subject, normalizedDiff, needed);
            selectedQuestions = [...selectedQuestions, ...aiQuestions];
        }
        // Shuffle questions order for this attempt
        selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
        // 4. Create attempt record in database
        let attemptId;
        try {
            const attRes = await (0, index_js_1.query)(`INSERT INTO quiz_attempts (user_id, subject, difficulty, total_questions, status, is_reattempt)
         VALUES ($1, $2, $3, $4, 'in_progress', false)
         RETURNING id`, [userId, subject, normalizedDiff, selectedQuestions.length]);
            attemptId = attRes.rows[0].id;
            // Insert question snapshots
            for (let i = 0; i < selectedQuestions.length; i++) {
                const q = selectedQuestions[i];
                await (0, index_js_1.query)(`INSERT INTO quiz_attempt_questions (attempt_id, question_id, position, question_text, options, correct_option, explanation)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                    attemptId,
                    q.id && !q.id.startsWith('gen-') ? q.id : null,
                    i + 1,
                    q.question_text,
                    JSON.stringify(q.options),
                    q.correct_option,
                    q.explanation,
                ]);
            }
        }
        catch {
            // In-memory fallback
            attemptId = 'att-' + Date.now();
            mockAttempts.set(attemptId, {
                id: attemptId,
                user_id: userId,
                subject,
                difficulty: normalizedDiff,
                total_questions: selectedQuestions.length,
                score: 0,
                percentage: 0,
                status: 'in_progress',
                started_at: new Date().toISOString(),
                is_reattempt: false,
            });
            const qSnapshots = selectedQuestions.map((q, idx) => ({
                id: 'aq-' + Date.now() + '-' + idx,
                attempt_id: attemptId,
                question_id: q.id,
                position: idx + 1,
                question_text: q.question_text,
                options: q.options,
                correct_option: q.correct_option,
                explanation: q.explanation,
                selected_option: null,
            }));
            mockAttemptQuestions.set(attemptId, qSnapshots);
        }
        // Return to client: Strip out correct_option & explanation for security!
        res.status(201).json({
            attempt_id: attemptId,
            subject,
            difficulty: normalizedDiff,
            total_questions: selectedQuestions.length,
            is_reattempt: false,
            questions: selectedQuestions.map((q, idx) => ({
                position: idx + 1,
                question_text: q.question_text,
                options: q.options,
            })),
        });
    }
    catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({ error: 'Failed to start quiz attempt' });
    }
}
/**
 * POST /api/quiz/reattempt/:attemptId
 * Reattempts a previous quiz with EXACT same questions, options, and order.
 * Saves as a new result without overwriting the previous one.
 */
async function reattemptQuiz(req, res) {
    const userId = req.user.id;
    const { attemptId } = req.params;
    try {
        let originalAttempt;
        let originalQuestions = [];
        try {
            const attRes = await (0, index_js_1.query)(`SELECT id, user_id, subject, difficulty, total_questions 
         FROM quiz_attempts 
         WHERE id = $1 AND user_id = $2`, [attemptId, userId]);
            if (attRes.rows.length === 0) {
                res.status(404).json({ error: 'Original quiz attempt not found or unauthorized' });
                return;
            }
            originalAttempt = attRes.rows[0];
            const qRes = await (0, index_js_1.query)(`SELECT question_id, position, question_text, options, correct_option, explanation
         FROM quiz_attempt_questions
         WHERE attempt_id = $1
         ORDER BY position ASC`, [attemptId]);
            originalQuestions = qRes.rows.map((r) => ({
                ...r,
                options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
            }));
        }
        catch {
            // In-memory fallback
            originalAttempt = mockAttempts.get(attemptId);
            if (!originalAttempt || originalAttempt.user_id !== userId) {
                res.status(404).json({ error: 'Original quiz attempt not found or unauthorized' });
                return;
            }
            originalQuestions = (mockAttemptQuestions.get(attemptId) || []).sort((a, b) => a.position - b.position);
        }
        if (originalQuestions.length === 0) {
            res.status(400).json({ error: 'Original attempt has no questions recorded' });
            return;
        }
        // Create a NEW attempt row marking is_reattempt = true
        let newAttemptId;
        try {
            const newAttRes = await (0, index_js_1.query)(`INSERT INTO quiz_attempts (user_id, subject, difficulty, total_questions, status, is_reattempt, original_attempt_id)
         VALUES ($1, $2, $3, $4, 'in_progress', true, $5)
         RETURNING id`, [userId, originalAttempt.subject, originalAttempt.difficulty, originalQuestions.length, originalAttempt.id]);
            newAttemptId = newAttRes.rows[0].id;
            // Copy exact questions in exact order
            for (const q of originalQuestions) {
                await (0, index_js_1.query)(`INSERT INTO quiz_attempt_questions (attempt_id, question_id, position, question_text, options, correct_option, explanation)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                    newAttemptId,
                    q.question_id,
                    q.position,
                    q.question_text,
                    JSON.stringify(q.options),
                    q.correct_option,
                    q.explanation,
                ]);
            }
        }
        catch {
            newAttemptId = 'att-re-' + Date.now();
            mockAttempts.set(newAttemptId, {
                id: newAttemptId,
                user_id: userId,
                subject: originalAttempt.subject,
                difficulty: originalAttempt.difficulty,
                total_questions: originalQuestions.length,
                score: 0,
                percentage: 0,
                status: 'in_progress',
                started_at: new Date().toISOString(),
                is_reattempt: true,
                original_attempt_id: originalAttempt.id,
            });
            const clonedQuestions = originalQuestions.map((q) => ({
                ...q,
                id: 'aq-' + Date.now() + '-' + q.position,
                attempt_id: newAttemptId,
                selected_option: null,
            }));
            mockAttemptQuestions.set(newAttemptId, clonedQuestions);
        }
        // Return to client stripped of answers
        res.status(201).json({
            attempt_id: newAttemptId,
            subject: originalAttempt.subject,
            difficulty: originalAttempt.difficulty,
            total_questions: originalQuestions.length,
            is_reattempt: true,
            original_attempt_id: originalAttempt.id,
            questions: originalQuestions.map((q) => ({
                position: q.position,
                question_text: q.question_text,
                options: q.options,
            })),
        });
    }
    catch (error) {
        console.error('Error in reattemptQuiz:', error);
        res.status(500).json({ error: 'Failed to create reattempt' });
    }
}
/**
 * POST /api/quiz/submit/:attemptId
 * Submits answers, grades on the server, calculates score & percentage
 */
async function submitQuiz(req, res) {
    const userId = req.user.id;
    const { attemptId } = req.params;
    const { answers } = req.body; // map: { [position]: selected_option_index }
    try {
        let questions = [];
        let attempt;
        try {
            const attRes = await (0, index_js_1.query)(`SELECT id, user_id, subject, difficulty, status, is_reattempt 
         FROM quiz_attempts 
         WHERE id = $1 AND user_id = $2`, [attemptId, userId]);
            if (attRes.rows.length === 0) {
                res.status(404).json({ error: 'Attempt not found or unauthorized' });
                return;
            }
            attempt = attRes.rows[0];
            if (attempt.status === 'completed') {
                res.status(400).json({ error: 'This quiz attempt has already been submitted' });
                return;
            }
            const qRes = await (0, index_js_1.query)(`SELECT id, position, question_text, options, correct_option, explanation
         FROM quiz_attempt_questions
         WHERE attempt_id = $1
         ORDER BY position ASC`, [attemptId]);
            questions = qRes.rows.map((r) => ({
                ...r,
                options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
            }));
        }
        catch {
            attempt = mockAttempts.get(attemptId);
            if (!attempt || attempt.user_id !== userId) {
                res.status(404).json({ error: 'Attempt not found or unauthorized' });
                return;
            }
            if (attempt.status === 'completed') {
                res.status(400).json({ error: 'This quiz attempt has already been submitted' });
                return;
            }
            questions = mockAttemptQuestions.get(attemptId) || [];
        }
        // Grade answers
        let score = 0;
        const reviewedQuestions = [];
        for (const q of questions) {
            const userSelected = answers && answers[q.position] !== undefined ? Number(answers[q.position]) : null;
            const isCorrect = userSelected !== null && userSelected === q.correct_option;
            if (isCorrect) {
                score++;
            }
            reviewedQuestions.push({
                position: q.position,
                question_text: q.question_text,
                options: q.options,
                selected_option: userSelected,
                correct_option: q.correct_option,
                is_correct: isCorrect,
                explanation: q.explanation,
            });
            // Update question record
            try {
                await (0, index_js_1.query)(`UPDATE quiz_attempt_questions
           SET selected_option = $1, is_correct = $2
           WHERE id = $3`, [userSelected, isCorrect, q.id]);
            }
            catch {
                q.selected_option = userSelected;
                q.is_correct = isCorrect;
            }
        }
        const totalQuestions = questions.length;
        const percentage = Math.round((score / totalQuestions) * 100 * 100) / 100;
        // Update attempt
        try {
            await (0, index_js_1.query)(`UPDATE quiz_attempts
         SET score = $1, percentage = $2, status = 'completed', completed_at = NOW()
         WHERE id = $3`, [score, percentage, attemptId]);
        }
        catch {
            attempt.score = score;
            attempt.percentage = percentage;
            attempt.status = 'completed';
            attempt.completed_at = new Date().toISOString();
        }
        res.json({
            message: 'Quiz submitted successfully',
            attempt_id: attemptId,
            subject: attempt.subject,
            difficulty: attempt.difficulty,
            score,
            total_questions: totalQuestions,
            percentage,
            is_reattempt: attempt.is_reattempt,
            questions: reviewedQuestions,
        });
    }
    catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz attempt' });
    }
}
/**
 * GET /api/quiz/history
 * Returns user's past quiz attempts
 */
async function getQuizHistory(req, res) {
    const userId = req.user.id;
    try {
        try {
            const { rows } = await (0, index_js_1.query)(`SELECT id, subject, difficulty, score, total_questions, percentage, status, started_at, completed_at, is_reattempt, original_attempt_id
         FROM quiz_attempts
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY completed_at DESC`, [userId]);
            res.json({ attempts: rows });
        }
        catch {
            const userAttempts = [];
            for (const att of mockAttempts.values()) {
                if (att.user_id === userId && att.status === 'completed') {
                    userAttempts.push(att);
                }
            }
            userAttempts.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
            res.json({ attempts: userAttempts });
        }
    }
    catch (error) {
        console.error('Error in getQuizHistory:', error);
        res.status(500).json({ error: 'Failed to load quiz history' });
    }
}
/**
 * GET /api/quiz/analytics
 * Returns subject-wise performance and overall accuracy
 */
async function getQuizAnalytics(req, res) {
    const userId = req.user.id;
    try {
        let attempts = [];
        try {
            const resDb = await (0, index_js_1.query)(`SELECT id, subject, difficulty, score, total_questions, percentage, completed_at
         FROM quiz_attempts
         WHERE user_id = $1 AND status = 'completed'`, [userId]);
            attempts = resDb.rows;
        }
        catch {
            for (const att of mockAttempts.values()) {
                if (att.user_id === userId && att.status === 'completed') {
                    attempts.push(att);
                }
            }
        }
        if (attempts.length === 0) {
            res.json({
                total_quizzes: 0,
                average_percentage: 0,
                total_questions: 0,
                total_correct: 0,
                subject_stats: [],
                difficulty_stats: [],
            });
            return;
        }
        const totalQuizzes = attempts.length;
        let sumScore = 0;
        let sumTotal = 0;
        let sumPercentage = 0;
        const subjectMap = {};
        const diffMap = {};
        for (const a of attempts) {
            const s = Number(a.score);
            const t = Number(a.total_questions);
            const p = Number(a.percentage);
            sumScore += s;
            sumTotal += t;
            sumPercentage += p;
            // Subject
            if (!subjectMap[a.subject]) {
                subjectMap[a.subject] = { attempts: 0, score: 0, total: 0, percentages: [] };
            }
            subjectMap[a.subject].attempts++;
            subjectMap[a.subject].score += s;
            subjectMap[a.subject].total += t;
            subjectMap[a.subject].percentages.push(p);
            // Difficulty
            if (!diffMap[a.difficulty]) {
                diffMap[a.difficulty] = { attempts: 0, percentages: [] };
            }
            diffMap[a.difficulty].attempts++;
            diffMap[a.difficulty].percentages.push(p);
        }
        const subjectStats = Object.entries(subjectMap).map(([subject, data]) => ({
            subject,
            attempts: data.attempts,
            avg_percentage: Math.round((data.percentages.reduce((acc, curr) => acc + curr, 0) / data.attempts) * 10) / 10,
            best_percentage: Math.max(...data.percentages),
            total_score: data.score,
            total_questions: data.total,
        }));
        const difficultyStats = Object.entries(diffMap).map(([difficulty, data]) => ({
            difficulty,
            attempts: data.attempts,
            avg_percentage: Math.round((data.percentages.reduce((acc, curr) => acc + curr, 0) / data.attempts) * 10) / 10,
        }));
        res.json({
            total_quizzes: totalQuizzes,
            average_percentage: Math.round((sumPercentage / totalQuizzes) * 10) / 10,
            total_questions: sumTotal,
            total_correct: sumScore,
            subject_stats: subjectStats,
            difficulty_stats: difficultyStats,
        });
    }
    catch (error) {
        console.error('Error in getQuizAnalytics:', error);
        res.status(500).json({ error: 'Failed to compute analytics' });
    }
}
/**
 * GET /api/quiz/review/:attemptId
 * Review a past quiz attempt with correct answers and explanations
 */
async function getAttemptReview(req, res) {
    const userId = req.user.id;
    const { attemptId } = req.params;
    try {
        let attempt;
        let questions = [];
        try {
            const attRes = await (0, index_js_1.query)(`SELECT id, user_id, subject, difficulty, score, total_questions, percentage, completed_at, is_reattempt, original_attempt_id
         FROM quiz_attempts
         WHERE id = $1 AND user_id = $2`, [attemptId, userId]);
            if (attRes.rows.length === 0) {
                res.status(404).json({ error: 'Attempt not found or access denied' });
                return;
            }
            attempt = attRes.rows[0];
            const qRes = await (0, index_js_1.query)(`SELECT position, question_text, options, selected_option, correct_option, is_correct, explanation
         FROM quiz_attempt_questions
         WHERE attempt_id = $1
         ORDER BY position ASC`, [attemptId]);
            questions = qRes.rows.map((r) => ({
                ...r,
                options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
            }));
        }
        catch {
            attempt = mockAttempts.get(attemptId);
            if (!attempt || attempt.user_id !== userId) {
                res.status(404).json({ error: 'Attempt not found or access denied' });
                return;
            }
            questions = mockAttemptQuestions.get(attemptId) || [];
        }
        res.json({
            attempt,
            questions,
        });
    }
    catch (error) {
        console.error('Error in getAttemptReview:', error);
        res.status(500).json({ error: 'Failed to load attempt review' });
    }
}
