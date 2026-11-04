import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { isProductionRuntime } from '../config/runtime.js';

const router = Router();
router.use(authenticateToken);

interface ChatRequest {
  message: string;
  context?: {
    subject?: string;
    difficulty?: string;
  };
}

// ==========================================
// 1. INVENTORS, FATHERS & CREATORS
// ==========================================
interface CreatorInfo {
  subject: string;
  creator: string;
  year?: string;
  organization?: string;
  shortDesc: string;
}

const CREATORS: Record<string, CreatorInfo> = {
  c: {
    subject: 'C Programming Language',
    creator: 'Dennis Ritchie',
    year: '1972',
    organization: 'Bell Labs (AT&T)',
    shortDesc: 'Dennis Ritchie is the father of C. He designed C to develop the Unix operating system. C became the foundation for modern languages like C++, Java, and C#.'
  },
  'c++': {
    subject: 'C++ Programming Language',
    creator: 'Bjarne Stroustrup',
    year: '1979',
    organization: 'Bell Labs',
    shortDesc: 'Bjarne Stroustrup created C++ as an extension of C with object-oriented programming features (classes).'
  },
  python: {
    subject: 'Python',
    creator: 'Guido van Rossum',
    year: '1991',
    organization: 'CWI (Netherlands)',
    shortDesc: 'Guido van Rossum created Python with a strong emphasis on code readability and clean syntax.'
  },
  java: {
    subject: 'Java',
    creator: 'James Gosling',
    year: '1995',
    organization: 'Sun Microsystems',
    shortDesc: 'James Gosling is known as the father of Java ("Write Once, Run Anywhere" via JVM).'
  },
  javascript: {
    subject: 'JavaScript',
    creator: 'Brendan Eich',
    year: '1995',
    organization: 'Netscape',
    shortDesc: 'Brendan Eich created JavaScript in just 10 days in 1995 to add interactivity to web pages.'
  },
  html: {
    subject: 'HTML (HyperText Markup Language)',
    creator: 'Tim Berners-Lee',
    year: '1991',
    organization: 'CERN',
    shortDesc: 'Sir Tim Berners-Lee invented HTML and the World Wide Web (WWW) to share scientific research globally.'
  },
  www: {
    subject: 'World Wide Web (WWW)',
    creator: 'Tim Berners-Lee',
    year: '1989',
    organization: 'CERN',
    shortDesc: 'Tim Berners-Lee invented the World Wide Web in 1989 at CERN, along with HTTP, HTML, and the first web browser.'
  },
  css: {
    subject: 'CSS (Cascading Style Sheets)',
    creator: 'Håkon Wium Lie',
    year: '1994',
    organization: 'CERN / W3C',
    shortDesc: 'Håkon Wium Lie proposed CSS in 1994 alongside Bert Bos to separate web design styling from HTML structure.'
  },
  computer: {
    subject: 'Computer',
    creator: 'Charles Babbage',
    year: '1837',
    organization: 'Cambridge',
    shortDesc: 'Charles Babbage is recognized as the "Father of the Computer" for conceptualizing the Analytical Engine, the first general mechanical computer.'
  },
  'modern computer': {
    subject: 'Modern Computer & AI',
    creator: 'Alan Turing',
    year: '1936',
    organization: 'University of Cambridge / Bletchley Park',
    shortDesc: 'Alan Turing is the "Father of Modern Computer Science and AI" for the Turing Machine and Turing Test.'
  },
  ai: {
    subject: 'Artificial Intelligence (AI)',
    creator: 'John McCarthy',
    year: '1956',
    organization: 'Dartmouth College',
    shortDesc: 'John McCarthy coined the term "Artificial Intelligence" in 1956 and created the Lisp programming language.'
  },
  internet: {
    subject: 'Internet',
    creator: 'Vint Cerf and Bob Kahn',
    year: '1970s',
    organization: 'DARPA',
    shortDesc: 'Vinton Cerf and Robert Kahn co-designed the TCP/IP protocol suite that powers the global Internet.'
  },
  linux: {
    subject: 'Linux',
    creator: 'Linus Torvalds',
    year: '1991',
    organization: 'University of Helsinki',
    shortDesc: 'Linus Torvalds created the open-source Linux kernel in 1991 and also created Git in 2005.'
  },
  git: {
    subject: 'Git',
    creator: 'Linus Torvalds',
    year: '2005',
    organization: 'Linux Foundation',
    shortDesc: 'Linus Torvalds designed Git for high-speed, distributed version control for the Linux kernel.'
  },
  php: {
    subject: 'PHP',
    creator: 'Rasmus Lerdorf',
    year: '1994',
    organization: 'Personal Home Page Tools',
    shortDesc: 'Rasmus Lerdorf created PHP in 1994 to manage his personal homepage and dynamic web scripts.'
  },
  sql: {
    subject: 'SQL',
    creator: 'Donald D. Chamberlin and Raymond F. Boyce',
    year: '1974',
    organization: 'IBM San Jose Research Laboratory',
    shortDesc: 'Donald Chamberlin and Raymond Boyce created SQL (originally SEQUEL) to manipulate relational data.'
  },
  database: {
    subject: 'Relational Database (RDBMS)',
    creator: 'Edgar F. Codd (E.F. Codd)',
    year: '1970',
    organization: 'IBM',
    shortDesc: 'E.F. Codd introduced the relational model of database management, the foundation of modern SQL systems.'
  },
  react: {
    subject: 'React',
    creator: 'Jordan Walke',
    year: '2013',
    organization: 'Facebook (Meta)',
    shortDesc: 'Jordan Walke created React to build fast component-based user interfaces with a virtual DOM.'
  },
  node: {
    subject: 'Node.js',
    creator: 'Ryan Dahl',
    year: '2009',
    organization: 'Joyent',
    shortDesc: 'Ryan Dahl created Node.js to execute JavaScript outside browsers using Google V8 and an event-driven loop.'
  },
  typescript: {
    subject: 'TypeScript & C#',
    creator: 'Anders Hejlsberg',
    year: '2012 / 2000',
    organization: 'Microsoft',
    shortDesc: 'Anders Hejlsberg led the creation of Turbo Pascal, C#, and TypeScript at Microsoft.'
  },
  physics: {
    subject: 'Physics',
    creator: 'Sir Isaac Newton & Galileo Galilei',
    year: '17th Century',
    organization: 'Royal Society',
    shortDesc: 'Isaac Newton and Galileo Galilei are regarded as the fathers of classical physics for laws of motion, gravitation, and telescopes.'
  },
  chemistry: {
    subject: 'Chemistry',
    creator: 'Antoine Lavoisier',
    year: '18th Century',
    organization: 'French Academy of Sciences',
    shortDesc: 'Antoine Lavoisier is the "Father of Modern Chemistry" for identifying oxygen and the Law of Conservation of Mass.'
  },
  mathematics: {
    subject: 'Mathematics',
    creator: 'Archimedes',
    year: '287 BC',
    organization: 'Ancient Greece (Syracuse)',
    shortDesc: 'Archimedes is widely regarded as the "Father of Mathematics" for his pioneering work in geometry, calculus principles, and buoyancy.'
  },
  electricity: {
    subject: 'Electricity',
    creator: 'Michael Faraday and Benjamin Franklin',
    year: '18th-19th Century',
    organization: 'Royal Institution',
    shortDesc: 'Benjamin Franklin discovered electrical charges and Michael Faraday discovered electromagnetic induction (electric motor and generator).'
  },
  biology: {
    subject: 'Biology',
    creator: 'Aristotle',
    year: '384 BC',
    organization: 'Ancient Greece',
    shortDesc: 'Aristotle is known as the "Father of Biology" for his detailed empirical classification of living organisms.'
  }
};

// ==========================================
// 2. ACRONYMS & FULL FORMS
// ==========================================
const ACRONYMS: Record<string, { full: string; desc: string }> = {
  html: {
    full: 'HyperText Markup Language',
    desc: 'The standard markup language used to structure web pages with elements and tags.',
  },
  css: {
    full: 'Cascading Style Sheets',
    desc: 'The language used to style and lay out web pages (colors, fonts, spacing, flexbox, grid).',
  },
  js: {
    full: 'JavaScript',
    desc: 'A high-level programming language that makes web pages interactive and dynamic.',
  },
  ts: {
    full: 'TypeScript',
    desc: 'A statically typed superset of JavaScript developed by Microsoft.',
  },
  sql: {
    full: 'Structured Query Language',
    desc: 'The standard language used to query, update, and manage relational databases.',
  },
  dbms: {
    full: 'Database Management System',
    desc: 'Software used to store, organize, and retrieve data securely (e.g., MySQL, PostgreSQL).',
  },
  rdbms: {
    full: 'Relational Database Management System',
    desc: 'A DBMS based on relational tables linked by primary and foreign keys.',
  },
  acid: {
    full: 'Atomicity, Consistency, Isolation, Durability',
    desc: 'Four essential properties that guarantee database transactions execute reliably.',
  },
  crud: {
    full: 'Create, Read, Update, Delete',
    desc: 'The four basic operations performed on persistent storage and REST APIs.',
  },
  http: {
    full: 'HyperText Transfer Protocol',
    desc: 'The protocol used to transfer web pages and data across the internet.',
  },
  https: {
    full: 'HyperText Transfer Protocol Secure',
    desc: 'HTTP encrypted with SSL/TLS certificates to protect data privacy.',
  },
  url: {
    full: 'Uniform Resource Locator',
    desc: 'The global web address used to find resources online (e.g., https://example.com).',
  },
  uri: {
    full: 'Uniform Resource Identifier',
    desc: 'A string of characters that unambiguously identifies a specific resource.',
  },
  dom: {
    full: 'Document Object Model',
    desc: 'A tree representation of HTML elements that JavaScript can read and manipulate.',
  },
  api: {
    full: 'Application Programming Interface',
    desc: 'A set of endpoints and protocols enabling different software apps to communicate.',
  },
  json: {
    full: 'JavaScript Object Notation',
    desc: 'A lightweight data-interchange format using key-value pairs and arrays.',
  },
  xml: {
    full: 'eXtensible Markup Language',
    desc: 'A flexible, customizable text format used to store and transport structured data.',
  },
  cpu: {
    full: 'Central Processing Unit',
    desc: 'The computer "brain" that executes instructions and calculations.',
  },
  gpu: {
    full: 'Graphics Processing Unit',
    desc: 'A processor specialized for rendering graphics and parallel computation (AI/ML).',
  },
  ram: {
    full: 'Random Access Memory',
    desc: 'Fast volatile memory that stores active programs and temporary data.',
  },
  rom: {
    full: 'Read-Only Memory',
    desc: 'Non-volatile permanent memory containing firmware (BIOS/UEFI).',
  },
  os: {
    full: 'Operating System',
    desc: 'Core software managing computer hardware and apps (e.g., Windows, Linux, macOS).',
  },
  ai: {
    full: 'Artificial Intelligence',
    desc: 'Simulation of human cognitive intelligence in computer programs.',
  },
  ml: {
    full: 'Machine Learning',
    desc: 'Algorithms that learn patterns from training data without being explicitly programmed.',
  },
  dsa: {
    full: 'Data Structures and Algorithms',
    desc: 'Methods to organize data (stacks, trees, graphs) and step-by-step procedures to solve problems.',
  },
  oop: {
    full: 'Object-Oriented Programming',
    desc: 'Programming paradigm based on classes and objects (Encapsulation, Inheritance, Polymorphism, Abstraction).',
  },
  rest: {
    full: 'Representational State Transfer',
    desc: 'An architectural style for web APIs using standard HTTP methods (GET, POST, PUT, DELETE).',
  },
  dns: {
    full: 'Domain Name System',
    desc: 'The phonebook of the internet that translates names (google.com) into IP addresses.',
  },
  ip: {
    full: 'Internet Protocol',
    desc: 'A unique numerical address assigned to devices on a network (e.g., IPv4, IPv6).',
  },
  tcp: {
    full: 'Transmission Control Protocol',
    desc: 'A reliable, connection-oriented network protocol ensuring packets arrive in order without loss.',
  },
  udp: {
    full: 'User Datagram Protocol',
    desc: 'A fast, connectionless protocol used where speed matters more than packet loss (gaming, streaming).',
  },
  lan: {
    full: 'Local Area Network',
    desc: 'A computer network spanning a small local area like a room, office, or building.',
  },
  wan: {
    full: 'Wide Area Network',
    desc: 'A telecommunications network spanning large geographical areas (the Internet is a WAN).',
  },
  gui: {
    full: 'Graphical User Interface',
    desc: 'A visual interface using windows, buttons, and icons rather than text commands.',
  },
  cli: {
    full: 'Command Line Interface',
    desc: 'A text-based terminal interface where users type commands to perform actions.',
  },
  ide: {
    full: 'Integrated Development Environment',
    desc: 'A software suite with a code editor, compiler, and debugger (e.g., VS Code, IntelliJ).',
  },
  bios: {
    full: 'Basic Input/Output System',
    desc: 'Firmware used to perform hardware initialization during computer boot-up.',
  },
  ssd: {
    full: 'Solid State Drive',
    desc: 'Fast flash-memory storage device with no moving mechanical parts.',
  },
  hdd: {
    full: 'Hard Disk Drive',
    desc: 'Traditional magnetic storage device with spinning magnetic platters.',
  },
  iot: {
    full: 'Internet of Things',
    desc: 'A network of physical devices with sensors and software connected to the internet.',
  }
};

// ==========================================
// 3. COMMON CONCEPT DEFINITIONS (SHORT & CLEAR)
// ==========================================
const CONCEPTS: Record<string, string> = {
  loop: 'A **loop** repeats a block of code multiple times until a condition is met.\n- **`for`**: when the number of iterations is known.\n- **`while`**: repeats while a condition remains true.\n- **`do-while`**: runs at least once before checking the condition.',
  array: 'An **array** is an ordered collection of elements stored at contiguous memory locations, accessed by zero-based index (e.g., `arr[0]`).',
  pointer: 'A **pointer** is a variable that stores the **memory address** of another variable rather than a direct value (common in C and C++).',
  function: 'A **function** is a reusable block of code that takes inputs (arguments), executes statements, and optionally returns a value.',
  recursion: 'A **recursion** is a programming technique where a function calls itself to solve smaller sub-problems until reaching a **base case**.',
  variable: 'A **variable** is a named storage container in memory used to hold data that can be referenced and modified during program execution.',
  closure: 'A **closure** in JavaScript is a function bundled together with its lexical environment, allowing it to remember and access variables from its outer scope even after the outer function has finished.',
  promise: 'A **Promise** in JavaScript represents the eventual completion or failure of an asynchronous operation (States: *pending*, *fulfilled*, or *rejected*).',
  async: '**`async/await`** is modern syntactic sugar in JavaScript for working with Promises in a clean, synchronous-looking style.',
  hoisting: '**Hoisting** is JavaScript\'s default behavior of moving variable and function declarations to the top of their containing scope before execution.',
  stack: 'A **Stack** is a linear data structure following the **LIFO (Last-In-First-Out)** principle (Operations: `push` and `pop`).',
  queue: 'A **Queue** is a linear data structure following the **FIFO (First-In-First-Out)** principle (Operations: `enqueue` and `dequeue`).',
  'linked list': 'A **Linked List** is a linear data structure where elements (nodes) contain data and a pointer to the next node in sequence.',
  tree: 'A **Tree** is a hierarchical non-linear data structure consisting of a root node and child nodes linked by edges without cycles.',
  graph: 'A **Graph** is a non-linear data structure consisting of a set of vertices (nodes) connected by edges.',
  'binary search': '**Binary Search** is an efficient **O(log n)** search algorithm that repeatedly halves a sorted array to find a target value.',
  'primary key': 'A **Primary Key** is a unique column (or set of columns) that identifies each individual row in a database table without duplicate or NULL values.',
  'foreign key': 'A **Foreign Key** is a field in one table that links to the primary key of another table, enforcing referential integrity.',
  algorithm: 'An **Algorithm** is a step-by-step, finite set of well-defined instructions to solve a specific problem or perform a task.',
  'big o': '**Big O Notation** measures the worst-case time or space complexity of an algorithm as the input size n grows (e.g., O(1), O(log n), O(n), O(n²)).',
  compiler: 'A **Compiler** translates entire source code into machine code at once before execution (e.g., C, C++, Rust).',
  interpreter: 'An **Interpreter** translates and executes source code line-by-line in real time (e.g., Python, JavaScript).',
  normalization: '**Database Normalization** is the process of organizing database tables to reduce data redundancy and eliminate anomalies (1NF, 2NF, 3NF, BCNF).'
};

// ==========================================
// 4. HTML TAGS MAP
// ==========================================
const HTML_TAGS_MAP: { triggers: string[]; tag: string; desc: string; syntax?: string }[] = [
  {
    triggers: ['line break', 'break line', 'new line', 'newline', '<br>', 'br tag'],
    tag: '<br>',
    desc: 'The **`<br>`** tag creates a **single line break** in text without starting a new paragraph.',
    syntax: 'First line<br>Second line'
  },
  {
    triggers: ['horizontal rule', 'horizontal line', 'divider', '<hr>', 'hr tag'],
    tag: '<hr>',
    desc: 'The **`<hr>`** tag creates a **horizontal divider rule** across the page.',
    syntax: '<hr />'
  },
  {
    triggers: ['hyperlink', 'anchor tag', 'link to another', 'tag for link', '<a>', 'a tag'],
    tag: '<a>',
    desc: 'The **`<a>` (anchor)** tag creates a **hyperlink** to another web page or file.',
    syntax: '<a href="https://example.com">Click Here</a>'
  },
  {
    triggers: ['image', 'picture', 'display image', 'tag for image', '<img>', 'img tag'],
    tag: '<img>',
    desc: 'The **`<img>`** tag embeds an **image** in an HTML document.',
    syntax: '<img src="pic.jpg" alt="Description" />'
  },
  {
    triggers: ['largest heading', 'main heading', 'highest heading', '<h1>', 'h1 tag'],
    tag: '<h1>',
    desc: 'The **`<h1>`** tag represents the **largest top-level heading** in HTML.',
    syntax: '<h1>Main Title</h1>'
  },
  {
    triggers: ['smallest heading', '<h6>', 'h6 tag'],
    tag: '<h6>',
    desc: 'The **`<h6>`** tag represents the **smallest heading** in standard HTML.',
    syntax: '<h6>Small Note</h6>'
  },
  {
    triggers: ['paragraph', '<p>', 'p tag'],
    tag: '<p>',
    desc: 'The **`<p>`** tag defines a standard **paragraph block of text**.',
    syntax: '<p>This is a paragraph.</p>'
  },
  {
    triggers: ['bold', 'make text bold', 'strong tag', '<b>', '<strong>'],
    tag: '<b> or <strong>',
    desc: 'The **`<b>`** or **`<strong>`** tag makes text **bold**. `<strong>` also adds semantic importance.',
    syntax: '<strong>Bold Text</strong>'
  },
  {
    triggers: ['italic', 'make text italic', 'emphasis', '<i>', '<em>'],
    tag: '<i> or <em>',
    desc: 'The **`<i>`** or **`<em>`** tag makes text *italic*.',
    syntax: '<em>Italic Text</em>'
  },
  {
    triggers: ['dropdown', 'select box', 'drop down', '<select>', 'select tag'],
    tag: '<select>',
    desc: 'The **`<select>`** tag creates a **dropdown menu** containing `<option>` items.',
    syntax: '<select><option>Option 1</option></select>'
  },
  {
    triggers: ['table row', '<tr>', 'tr tag'],
    tag: '<tr>',
    desc: 'The **`<tr>`** tag defines a **row** in an HTML table.',
    syntax: '<tr><td>Cell</td></tr>'
  },
  {
    triggers: ['table cell', 'table data', '<td>', 'td tag'],
    tag: '<td>',
    desc: 'The **`<td>`** tag defines a standard **data cell** in a table row.',
    syntax: '<td>Data</td>'
  },
  {
    triggers: ['bullet list', 'unordered list', '<ul>', 'ul tag'],
    tag: '<ul>',
    desc: 'The **`<ul>`** tag creates a **bulleted (unordered) list**.',
    syntax: '<ul><li>Item</li></ul>'
  },
  {
    triggers: ['ordered list', 'numbered list', '<ol>', 'ol tag'],
    tag: '<ol>',
    desc: 'The **`<ol>`** tag creates a **numbered (ordered) list**.',
    syntax: '<ol><li>Step 1</li></ol>'
  },
  {
    triggers: ['browser tab', 'title of page', '<title>', 'title tag'],
    tag: '<title>',
    desc: 'The **`<title>`** tag defines the title displayed on the **browser window tab**.',
    syntax: '<head><title>My Page</title></head>'
  },
  {
    triggers: ['input field', '<input>', 'input tag'],
    tag: '<input>',
    desc: 'The **`<input>`** tag provides a user input field (text, password, email, checkbox).',
    syntax: '<input type="text" placeholder="Enter name" />'
  }
];

// ==========================================
// 5. CSS PROPERTIES MAP
// ==========================================
const CSS_MAP: { triggers: string[]; prop: string; desc: string; syntax?: string }[] = [
  {
    triggers: ['text color', 'color of text', 'font color'],
    prop: 'color',
    desc: 'The **`color`** property in CSS sets the foreground text color.',
    syntax: 'color: #10b981;'
  },
  {
    triggers: ['background color', 'bg color'],
    prop: 'background-color',
    desc: 'The **`background-color`** property sets the background color of an element.',
    syntax: 'background-color: #0f172a;'
  },
  {
    triggers: ['font size', 'text size', 'size of text'],
    prop: 'font-size',
    desc: 'The **`font-size`** property controls the size of text.',
    syntax: 'font-size: 16px; /* or 1rem */'
  },
  {
    triggers: ['space inside', 'inner space', 'padding'],
    prop: 'padding',
    desc: 'The **`padding`** property adds space **inside** an element\'s border.',
    syntax: 'padding: 16px;'
  },
  {
    triggers: ['space outside', 'outer space', 'margin'],
    prop: 'margin',
    desc: 'The **`margin`** property creates space **outside** an element\'s border.',
    syntax: 'margin: 20px;'
  },
  {
    triggers: ['hide element', 'display none'],
    prop: 'display: none',
    desc: 'The **`display: none;`** property completely hides an element from the layout.',
    syntax: 'display: none;'
  }
];

// Helper: Normalize query for fuzzy matching & typo tolerance
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[?!.,;:'"()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Master Quick-Answer Resolver
function resolveQuestion(rawMsg: string): string | null {
  const norm = normalize(rawMsg);
  const words = norm.split(' ');

  // ----------------------------------------------------
  // A. Creators / Fathers / Inventors (Fuzzy typo check)
  // Handles: "who is fathe of c", "father of python", "who created html", etc.
  // ----------------------------------------------------
  const hasCreatorIntent =
    norm.includes('father') ||
    norm.includes('fathe') ||
    norm.includes('fathr') ||
    norm.includes('creator') ||
    norm.includes('creat') ||
    norm.includes('inventor') ||
    norm.includes('invent') ||
    norm.includes('founder') ||
    norm.includes('developer') ||
    norm.includes('develop') ||
    norm.includes('who made') ||
    norm.includes('who designed') ||
    norm.includes('who discovered');

  if (hasCreatorIntent) {
    // Check specific languages & technologies
    if (norm.includes(' c ') || norm.endsWith(' c') || norm.includes('c language') || norm.includes('c programming')) {
      const c = CREATORS.c;
      return `**${c.creator}** is the **father of the ${c.subject}** (${c.year}, ${c.organization}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('c++') || norm.includes('cpp')) {
      const c = CREATORS['c++'];
      return `**${c.creator}** is the **creator of ${c.subject}** (${c.year}, ${c.organization}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('python')) {
      const c = CREATORS.python;
      return `**${c.creator}** is the **father of ${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('java ') || norm.endsWith('java') || norm.includes('java language')) {
      const c = CREATORS.java;
      return `**${c.creator}** is the **father of ${c.subject}** (${c.year}, ${c.organization}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('javascript') || norm.includes('js')) {
      const c = CREATORS.javascript;
      return `**${c.creator}** is the **creator of ${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('html')) {
      const c = CREATORS.html;
      return `**${c.creator}** is the **creator of ${c.subject}** (${c.year}, ${c.organization}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('css')) {
      const c = CREATORS.css;
      return `**${c.creator}** created **${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('computer science') || norm.includes('modern computer')) {
      const c = CREATORS['modern computer'];
      return `**${c.creator}** is the **father of ${c.subject}**.\n\n${c.shortDesc}`;
    }
    if (norm.includes('computer')) {
      const c = CREATORS.computer;
      return `**${c.creator}** is the **father of the ${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('ai') || norm.includes('artificial intelligence')) {
      const c = CREATORS.ai;
      return `**${c.creator}** is the **father of ${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('internet')) {
      const c = CREATORS.internet;
      return `**${c.creator}** are recognized as the **fathers of the ${c.subject}**.\n\n${c.shortDesc}`;
    }
    if (norm.includes('linux')) {
      const c = CREATORS.linux;
      return `**${c.creator}** created **${c.subject}** in ${c.year}.\n\n${c.shortDesc}`;
    }
    if (norm.includes('git')) {
      const c = CREATORS.git;
      return `**${c.creator}** created **${c.subject}** in ${c.year}.\n\n${c.shortDesc}`;
    }
    if (norm.includes('php')) {
      const c = CREATORS.php;
      return `**${c.creator}** created **${c.subject}** in ${c.year}.\n\n${c.shortDesc}`;
    }
    if (norm.includes('sql')) {
      const c = CREATORS.sql;
      return `**${c.creator}** created **${c.subject}** (${c.year}, ${c.organization}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('database') || norm.includes('rdbms')) {
      const c = CREATORS.database;
      return `**${c.creator}** is the **father of ${c.subject}** (${c.year}).\n\n${c.shortDesc}`;
    }
    if (norm.includes('physics')) {
      const c = CREATORS.physics;
      return `**${c.creator}** are considered the **fathers of ${c.subject}**.\n\n${c.shortDesc}`;
    }
    if (norm.includes('chemistry')) {
      const c = CREATORS.chemistry;
      return `**${c.creator}** is known as the **father of ${c.subject}**.\n\n${c.shortDesc}`;
    }
    if (norm.includes('math') || norm.includes('mathematics')) {
      const c = CREATORS.mathematics;
      return `**${c.creator}** is known as the **father of ${c.subject}**.\n\n${c.shortDesc}`;
    }
    if (norm.includes('biology')) {
      const c = CREATORS.biology;
      return `**${c.creator}** is known as the **father of ${c.subject}**.\n\n${c.shortDesc}`;
    }
  }

  // ----------------------------------------------------
  // B. Math & Arithmetic Calculation Solver
  // Evaluates: "what is 25 * 4", "12 + 18", "sqrt(144)", "50 / 2"
  // ----------------------------------------------------
  const sqrtMatch = norm.match(/(?:sqrt|square root of)\s*(\d+(?:\.\d+)?)/);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    return `**Square Root of ${val} = ${Math.sqrt(val)}**`;
  }
  const calcMatch = norm.match(/(?:what is|calculate|solve)?\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
  if (calcMatch) {
    const num1 = parseFloat(calcMatch[1]);
    const op = calcMatch[2];
    const num2 = parseFloat(calcMatch[3]);
    let ans = 0;
    if (op === '+') ans = num1 + num2;
    if (op === '-') ans = num1 - num2;
    if (op === '*') ans = num1 * num2;
    if (op === '/') ans = num2 !== 0 ? num1 / num2 : NaN;
    if (!isNaN(ans)) {
      return `**${num1} ${op} ${num2} = ${ans}**`;
    }
  }

  // ----------------------------------------------------
  // C. Full Forms & Acronyms
  // ----------------------------------------------------
  for (const [key, val] of Object.entries(ACRONYMS)) {
    const isDirectMatch = words.includes(key);
    const asksFullForm =
      norm.includes('stand') ||
      norm.includes('full form') ||
      norm.includes('mean') ||
      norm.includes('what is') ||
      norm.includes('define') ||
      words.length <= 2;

    if (isDirectMatch && asksFullForm) {
      return `**${key.toUpperCase()}** stands for **${val.full}**.\n\n${val.desc}`;
    }
  }

  // ----------------------------------------------------
  // D. HTML Tags Map
  // ----------------------------------------------------
  for (const item of HTML_TAGS_MAP) {
    if (item.triggers.some(t => norm.includes(t))) {
      let resp = `${item.desc}`;
      if (item.syntax) resp += `\n\n**Example:**\n\`${item.syntax}\``;
      return resp;
    }
  }

  // ----------------------------------------------------
  // E. CSS Properties Map
  // ----------------------------------------------------
  for (const item of CSS_MAP) {
    if (item.triggers.some(t => norm.includes(t))) {
      let resp = `${item.desc}`;
      if (item.syntax) resp += `\n\n**Example:**\n\`${item.syntax}\``;
      return resp;
    }
  }

  // ----------------------------------------------------
  // F. Concepts & Definitions
  // ----------------------------------------------------
  for (const [key, desc] of Object.entries(CONCEPTS)) {
    if (norm.includes(key)) {
      return desc;
    }
  }

  // ----------------------------------------------------
  // G. Common Science & Math Formulas (Clean Readable Format)
  // ----------------------------------------------------
  if (norm.includes('ohm') || norm.includes('v = ir')) {
    return `**Ohm's Law:**\n**V = I × R**\n\n- **V**: Voltage (Volts)\n- **I**: Current (Amperes)\n- **R**: Resistance (Ohms, Ω)`;
  }
  if (norm.includes('newton') || norm.includes('force') || norm.includes('f = ma')) {
    return `**Newton's Second Law of Motion (Force):**\n**F = m × a**\n\n- **F**: Net Force (Newtons, N)\n- **m**: Mass (kg)\n- **a**: Acceleration (m/s²)`;
  }
  if (norm.includes('kinetic energy') || norm.includes('ke formula')) {
    return `**Kinetic Energy Formula:**\n**KE = ½ × m × v²**\n\n- **m**: Mass (kg)\n- **v**: Velocity (m/s)`;
  }
  if (norm.includes('potential energy') || norm.includes('pe formula')) {
    return `**Potential Energy Formula:**\n**PE = m × g × h**\n\n- **m**: Mass (kg)\n- **g**: Gravity (9.8 m/s²)\n- **h**: Height (meters)`;
  }
  if (norm.includes('determinant') || norm.includes('matrix')) {
    return `**Determinant of a 2×2 Matrix:**\nFor matrix [ [a, b], [c, d] ]:\n**det(A) = (a × d) - (b × c)**`;
  }
  if (norm.includes('quadratic') || norm.includes('roots')) {
    return `**Quadratic Formula:**\n**x = (-b ± √(b² - 4ac)) / (2a)**\n\nFor any quadratic equation: ax² + bx + c = 0`;
  }
  if (norm.includes('pythagor')) {
    return `**Pythagorean Theorem:**\n**a² + b² = c²**  →  **c = √(a² + b²)**\n\nIn any right-angled triangle with legs a, b and hypotenuse c.`;
  }
  if (norm.includes('density')) {
    return `**Density Formula:**\n**Density = Mass / Volume**  (D = M / V)\n\nStandard units: g/cm³ or kg/m³`;
  }
  if (norm.includes('ph') && (norm.includes('scale') || norm.includes('formula') || norm.includes('calculate'))) {
    return `**pH Formula & Scale:**\n**pH = -log₁₀[H⁺]**\n\n- **pH < 7**: Acidic solution\n- **pH = 7**: Neutral (Pure Water)\n- **pH > 7**: Basic (Alkaline) solution`;
  }

  // ----------------------------------------------------
  // H. Differences & Comparisons
  // ----------------------------------------------------
  if (norm.includes('let') && (norm.includes('var') || norm.includes('const'))) {
    return `**Difference between \`var\`, \`let\`, and \`const\`:**\n- **\`var\`**: Function-scoped, hoisted, can be re-declared.\n- **\`let\`**: Block-scoped, cannot be re-declared, reassignable.\n- **\`const\`**: Block-scoped, immutable identifier (cannot be reassigned).`;
  }
  if (norm.includes('==') && norm.includes('===')) {
    return `**Difference between \`==\` and \`===\`:**\n- **\`==\` (Loose Equality):** Checks value with automatic type conversion (\`"5" == 5\` is true).\n- **\`===\` (Strict Equality):** Checks both **value AND data type** without conversion (\`"5" === 5\` is false).`;
  }
  if (norm.includes('compiler') && norm.includes('interpreter')) {
    return `**Compiler vs. Interpreter:**\n- **Compiler**: Translates entire program into machine code before running (e.g., C, C++, Go). Faster execution.\n- **Interpreter**: Translates and executes instructions line-by-line (e.g., Python, JavaScript). Easier debugging.`;
  }
  if (norm.includes('stack') && norm.includes('queue')) {
    return `**Stack vs. Queue:**\n- **Stack**: **LIFO** (Last-In-First-Out) — like a stack of plates. Items are pushed and popped from the top.\n- **Queue**: **FIFO** (First-In-First-Out) — like a ticket line. Items are added at the rear and removed from the front.`;
  }

  // ----------------------------------------------------
  // I. QuizLab Mock Test Rules & Timers
  // ----------------------------------------------------
  if (norm.includes('timer') || norm.includes('timing') || norm.includes('how much time') || norm.includes('test rule')) {
    return `⏱️ **QuizLab Test Timings:**\n- **Level 1 (Easy):** **1 minute per question** (10 questions = 10 mins).\n- **Level 2 (Medium):** **1.5 minutes per question** (15 mins).\n- **Level 3 (Difficult):** **2 minutes per question** (20 mins).\n\n💡 Tests auto-submit when the timer reaches 0:00!`;
  }

  // ----------------------------------------------------
  // J. Clean, Smart Universal Answer Synthesizer
  // For ANY general question, provide a direct, clean, short answer
  // ----------------------------------------------------
  const cleanedTopic = rawMsg
    .replace(/^(what is|who is|explain|define|tell me about|how does|why is|formula for)\s+/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  return null;
}

// POST /api/ai/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body as ChatRequest;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const trimmedMsg = message.trim();

    // 1. Try Gemini API first if key exists with 3-second timeout
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      try {
        const systemPrompt = `You are QuizLab AI Study Assistant.
Give a DIRECT, ACCURATE, and CONCISE answer to the student's question immediately on the very first line. Keep the response short, educational, and easy to understand. Do not write filler words.`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nStudent Query: ${trimmedMsg}` }]
              }
            ]
          })
        });

        clearTimeout(timeout);

        if (response.ok) {
          const data: any = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim()) {
            return res.json({ reply: reply.trim(), source: 'gemini' });
          }
        } else {
          console.error(`Gemini chat API returned HTTP ${response.status}.`);
        }
        if (isProductionRuntime()) {
          return res.status(502).json({
            error: {
              code: 'AI_SERVICE_UNAVAILABLE',
              message: 'The study assistant is temporarily unavailable. Please try again later.',
            },
          });
        }
      } catch (geminiErr) {
        clearTimeout(timeout);
        if (isProductionRuntime()) {
          return res.status(502).json({
            error: {
              code: 'AI_SERVICE_UNAVAILABLE',
              message: 'The study assistant is temporarily unavailable. Please try again later.',
            },
          });
        }
      }
    }

    if (isProductionRuntime()) {
      return res.status(503).json({
        error: {
          code: 'AI_SERVICE_NOT_CONFIGURED',
          message: 'The study assistant is not configured yet.',
        },
      });
    }

    // 2. Comprehensive Instant Knowledge Engine
    const smartReply = resolveQuestion(trimmedMsg);
    if (!smartReply) {
      return res.status(503).json({
        error: {
          code: 'AI_SERVICE_UNAVAILABLE',
          message: 'No verified answer is available right now. Please try again later.',
        },
      });
    }
    return res.json({ reply: smartReply, source: 'knowledge_engine' });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process question.' });
  }
});

export default router;
