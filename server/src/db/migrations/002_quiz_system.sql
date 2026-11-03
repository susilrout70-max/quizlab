-- Migration 002: Subject & Difficulty Quiz System with Reattempt & Analytics

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'difficult')),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
    explanation TEXT,
    source VARCHAR(50) DEFAULT 'curated',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_sub_diff ON questions(subject, difficulty);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    total_questions INT NOT NULL DEFAULT 5,
    score INT DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_reattempt BOOLEAN DEFAULT FALSE,
    original_attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_sub ON quiz_attempts(user_id, subject, difficulty);

CREATE TABLE IF NOT EXISTS quiz_attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    position INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    selected_option INT,
    correct_option INT NOT NULL,
    is_correct BOOLEAN,
    explanation TEXT
);

CREATE INDEX IF NOT EXISTS idx_attempt_questions_attempt ON quiz_attempt_questions(attempt_id);

-- Seed initial curated question bank across subjects and difficulties
INSERT INTO questions (subject, difficulty, question_text, options, correct_option, explanation, source)
VALUES
-- Computer Science (Easy)
('Computer Science', 'easy', 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management Links", "Home Tool Markup Language"]', 0, 'HTML is the standard markup language used to create web pages.', 'curated'),
('Computer Science', 'easy', 'Which data structure follows the First-In-First-Out (FIFO) principle?', '["Stack", "Queue", "Tree", "Graph"]', 1, 'A Queue operates under the First-In-First-Out principle.', 'curated'),
('Computer Science', 'easy', 'What is the primary function of RAM in a computer?', '["Permanent storage", "Displaying graphics", "Temporary volatile memory for running processes", "Cooling the CPU"]', 2, 'RAM holds working data and machine code currently in use temporarily.', 'curated'),
('Computer Science', 'easy', 'Which symbol is used for single-line comments in JavaScript?', '["#", "//", "/*", "<!--"]', 1, '// is used for single-line comments in JavaScript.', 'curated'),
('Computer Science', 'easy', 'Which protocol is used to transfer web pages securely across the Internet?', '["FTP", "SMTP", "HTTPS", "SNMP"]', 2, 'HTTPS encrypts communication between the browser and the web server.', 'curated'),

-- Computer Science (Medium)
('Computer Science', 'medium', 'What is the average time complexity of searching in a balanced Binary Search Tree?', '["O(1)", "O(n)", "O(log n)", "O(n log n)"]', 2, 'A balanced BST divides search space in half at each step, yielding O(log n).', 'curated'),
('Computer Science', 'medium', 'In relational databases, what does the ACID property "I" stand for?', '["Inheritance", "Isolation", "Index", "Iteration"]', 1, 'ACID stands for Atomicity, Consistency, Isolation, and Durability.', 'curated'),
('Computer Science', 'medium', 'Which sorting algorithm has a worst-case time complexity of O(n^2) but average O(n log n)?', '["Merge Sort", "Quick Sort", "Heap Sort", "Counting Sort"]', 1, 'Quick Sort worst case is O(n^2) when pivot choice is degenerate.', 'curated'),
('Computer Science', 'medium', 'What is a closure in JavaScript?', '["A function bundled with references to its surrounding lexical environment", "A method to close browser tabs", "A private class variable", "A loop termination statement"]', 0, 'Closures allow an inner function to access an outer function’s scope.', 'curated'),
('Computer Science', 'medium', 'Which HTTP status code signifies "Unauthorized access"?', '["400", "401", "403", "404"]', 1, 'HTTP 401 indicates that the request lacks valid authentication credentials.', 'curated'),

-- Computer Science (Difficult)
('Computer Science', 'difficult', 'Which concurrency problem occurs when two transactions read and update the same data concurrently without synchronization?', '["Deadlock", "Lost Update Anomaly", "Cache Stampede", "Starvation"]', 1, 'A Lost Update anomaly happens when an update overwrites another concurrent update.', 'curated'),
('Computer Science', 'difficult', 'In modern operating systems, what is the purpose of the Translation Lookaside Buffer (TLB)?', '["Cache for virtual-to-physical address translations", "Disk block allocation table", "Network packet buffer", "Interrupt vector cache"]', 0, 'The TLB caches page table entries to speed up virtual memory address translation.', 'curated'),
('Computer Science', 'difficult', 'Which of the following problems is proven to be NP-Complete?', '["Shortest Path in DAG", "Minimum Spanning Tree", "Boolean Satisfiability (3-SAT)", "Matrix Chain Multiplication"]', 2, 'Cook’s theorem proved that Boolean Satisfiability (SAT/3-SAT) is NP-Complete.', 'curated'),
('Computer Science', 'difficult', 'In distributed systems, what does the CAP theorem state is impossible to guarantee simultaneously in presence of network partitions?', '["Consistency and Availability", "Concurrency and Atomicity", "Performance and Durability", "Throughput and Latency"]', 0, 'The CAP theorem states a distributed system cannot guarantee both Consistency and Availability under Partition tolerance.', 'curated'),
('Computer Science', 'difficult', 'What is the time complexity of the Floyd-Warshall algorithm for all-pairs shortest paths?', '["O(V^2)", "O(V^3)", "O(V log V + E)", "O(E^2)"]', 1, 'Floyd-Warshall uses three nested loops over the vertices, giving O(V^3).', 'curated'),

-- Mathematics (Easy)
('Mathematics', 'easy', 'What is the square root of 144?', '["10", "12", "14", "16"]', 1, '12 * 12 = 144.', 'curated'),
('Mathematics', 'easy', 'What is the value of 7 * 8?', '["54", "56", "58", "64"]', 1, '7 multiplied by 8 equals 56.', 'curated'),
('Mathematics', 'easy', 'What is the sum of interior angles of a triangle?', '["90 degrees", "180 degrees", "270 degrees", "360 degrees"]', 1, 'The angles of any Euclidean triangle always add up to 180 degrees.', 'curated'),
('Mathematics', 'easy', 'What is 25% expressed as a decimal?', '["0.025", "0.25", "2.5", "25.0"]', 1, '25 / 100 = 0.25.', 'curated'),
('Mathematics', 'easy', 'What is the perimeter of a rectangle with length 6 and width 4?', '["20", "24", "10", "16"]', 0, 'Perimeter = 2 * (length + width) = 2 * (6 + 4) = 20.', 'curated'),

-- Mathematics (Medium)
('Mathematics', 'medium', 'What is the derivative of f(x) = 3x^2 + 5x - 7 with respect to x?', '["6x + 5", "3x + 5", "6x^2 + 5", "6x - 7"]', 0, 'Using the power rule: d/dx(3x^2) = 6x, and d/dx(5x) = 5.', 'curated'),
('Mathematics', 'medium', 'If a fair six-sided die is rolled, what is the probability of getting a prime number?', '["1/6", "1/3", "1/2", "2/3"]', 2, 'The prime numbers on a die are 2, 3, 5 (3 outcomes out of 6) = 1/2.', 'curated'),
('Mathematics', 'medium', 'Solve for x: 2^(x+1) = 32.', '["3", "4", "5", "6"]', 1, '32 = 2^5, so x + 1 = 5 => x = 4.', 'curated'),
('Mathematics', 'medium', 'What is the area of a circle with radius 7 (taking pi = 22/7)?', '["44", "154", "88", "196"]', 1, 'Area = pi * r^2 = (22/7) * 7 * 7 = 154.', 'curated'),
('Mathematics', 'medium', 'What is the determinant of a 2x2 matrix [[2, 3], [1, 4]]?', '["5", "8", "11", "3"]', 0, 'Det = (2*4) - (3*1) = 8 - 3 = 5.', 'curated'),

-- Mathematics (Difficult)
('Mathematics', 'difficult', 'What is the limit of (sin x) / x as x approaches 0?', '["0", "1", "Infinity", "Undefined"]', 1, 'By standard trigonometric limit / L’Hopital’s rule, lim(x->0) sin(x)/x = 1.', 'curated'),
('Mathematics', 'difficult', 'What is the integral of ln(x) dx?', '["x ln(x) - x + C", "1/x + C", "x^2/2 + C", "(ln x)^2/2 + C"]', 0, 'Using integration by parts: integral of ln(x) dx = x ln(x) - x + C.', 'curated'),
('Mathematics', 'difficult', 'What are the eigenvalues of the matrix [[3, 0], [0, 5]]?', '["3 and 5", "0 and 8", "15 and 0", "-3 and -5"]', 0, 'For a diagonal matrix, the diagonal elements are its eigenvalues.', 'curated'),
('Mathematics', 'difficult', 'How many non-isomorphic abelian groups of order 16 exist?', '["3", "4", "5", "6"]', 2, 'The number corresponds to integer partitions of 4: (4), (3,1), (2,2), (2,1,1), (1,1,1,1) -> 5 groups.', 'curated'),
('Mathematics', 'difficult', 'What is the sum of the infinite geometric series 1 + 1/3 + 1/9 + 1/27 + ...?', '["4/3", "3/2", "2", "Infinity"]', 1, 'Sum = a / (1 - r) = 1 / (1 - 1/3) = 1 / (2/3) = 3/2.', 'curated'),

-- Science (Easy)
('Science', 'easy', 'What chemical element has the symbol "O"?', '["Osmium", "Oxygen", "Gold", "Iron"]', 1, 'O stands for Oxygen on the periodic table.', 'curated'),
('Science', 'easy', 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1, 'Mars is called the Red Planet due to iron oxide on its surface.', 'curated'),
('Science', 'easy', 'What is the powerhouse of the cell?', '["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"]', 2, 'Mitochondria generate most of the chemical energy needed by cells (ATP).', 'curated'),
('Science', 'easy', 'At what temperature Celsius does water freeze under standard atmospheric pressure?', '["0", "-10", "32", "100"]', 0, 'Water freezes at 0 degrees Celsius.', 'curated'),
('Science', 'easy', 'What gas do green plants absorb from the atmosphere during photosynthesis?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"]', 1, 'Plants absorb carbon dioxide (CO2) and release oxygen during photosynthesis.', 'curated'),

-- Science (Medium)
('Science', 'medium', 'What is the SI unit of electric resistance?', '["Watt", "Volt", "Ampere", "Ohm"]', 3, 'The Ohm (symbol: Omega) is the SI unit of electrical resistance.', 'curated'),
('Science', 'medium', 'What is the pH value of pure distilled water at 25 degrees Celsius?', '["5", "7", "9", "14"]', 1, 'Pure water is neutral with a pH of 7.0.', 'curated'),
('Science', 'medium', 'Which organ in the human body produces the hormone insulin?', '["Liver", "Pancreas", "Kidney", "Thyroid"]', 1, 'The beta cells of the pancreas produce insulin to regulate blood glucose.', 'curated'),
('Science', 'medium', 'What is Newton’s Second Law of Motion expressed mathematically?', '["F = ma", "E = mc^2", "p = mv", "W = Fd"]', 0, 'Force equals mass multiplied by acceleration (F = ma).', 'curated'),
('Science', 'medium', 'What type of bond is formed by the sharing of electron pairs between atoms?', '["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"]', 1, 'A covalent bond involves the mutual sharing of electrons between atoms.', 'curated'),

-- Science (Difficult)
('Science', 'difficult', 'What is the half-life of Carbon-14 used in radiocarbon dating?', '["Approx. 1,200 years", "Approx. 5,730 years", "Approx. 25,000 years", "Approx. 100,000 years"]', 1, 'Carbon-14 has a half-life of approximately 5,730 years.', 'curated'),
('Science', 'difficult', 'Which fundamental force is mediated by gluons?', '["Gravitational force", "Electromagnetic force", "Strong nuclear force", "Weak nuclear force"]', 2, 'The strong nuclear force holds quarks together and is mediated by gluons.', 'curated'),
('Science', 'difficult', 'What thermodynamic quantity is described as a measure of disorder or randomness in a closed system?', '["Enthalpy", "Entropy", "Gibbs Free Energy", "Helmholtz Energy"]', 1, 'Entropy (S) quantifies the disorder or molecular randomness of a system.', 'curated'),
('Science', 'difficult', 'In cellular respiration, what is the net yield of ATP molecules produced directly by glycolysis per glucose molecule?', '["2 ATP", "4 ATP", "32 ATP", "36 ATP"]', 0, 'Glycolysis uses 2 ATP and produces 4 ATP, resulting in a net yield of 2 ATP.', 'curated'),
('Science', 'difficult', 'What phenomenon explains why the speed of light in vacuum is an invariant universal constant?', '["Special Relativity", "Quantum Entanglement", "Photoelectric Effect", "Compton Scattering"]', 0, 'Einstein’s theory of Special Relativity establishes that c is constant for all inertial observers.', 'curated')
ON CONFLICT DO NOTHING;
