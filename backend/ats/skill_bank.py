"""Curated skill / technology / soft-skill vocabulary used for rule-based
extraction and matching. This replaces an LLM or large NLP model with a
maintainable, offline-friendly dictionary approach.
"""

PROGRAMMING_LANGUAGES = [
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
    "dart", "lua", "haskell", "sql", "bash", "shell", "powershell", "objective-c",
]

FRAMEWORKS_LIBRARIES = [
    "react", "angular", "vue", "next.js", "nuxt", "svelte", "django", "flask",
    "fastapi", "spring", "spring boot", "express", "express.js", "node.js",
    "node", "laravel", "rails", "ruby on rails", ".net", "asp.net", "tensorflow",
    "pytorch", "keras", "scikit-learn", "pandas", "numpy", "opencv", "redux",
    "tailwind", "tailwindcss", "bootstrap", "jquery", "graphql", "rest api",
    "restful api", "grpc", "websocket", "electron", "flutter", "react native",
    "jest", "pytest", "mocha", "selenium", "cypress",
]

DATABASES = [
    "mysql", "postgresql", "postgres", "mongodb", "sqlite", "oracle", "redis",
    "elasticsearch", "cassandra", "dynamodb", "firebase", "firestore",
    "mariadb", "ms sql server", "sql server", "neo4j", "supabase",
]

CLOUD_DEVOPS = [
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform",
    "jenkins", "ci/cd", "github actions", "gitlab ci", "ansible", "nginx",
    "linux", "git", "github", "gitlab", "bitbucket", "heroku", "render",
    "vercel", "netlify", "cloudformation", "lambda", "ec2", "s3", "cloudwatch",
]

DATA_AI = [
    "machine learning", "deep learning", "data science", "data analysis",
    "natural language processing", "nlp", "computer vision", "data visualization",
    "big data", "spark", "hadoop", "etl", "tableau", "power bi", "excel",
    "statistics", "a/b testing", "data mining", "neural networks",
]

TOOLS = [
    "jira", "confluence", "figma", "postman", "vs code", "visual studio",
    "intellij", "eclipse", "slack", "trello", "notion", "agile", "scrum",
    "kanban", "linux", "unix", "webpack", "vite", "babel",
]

SOFT_SKILLS = [
    "communication", "teamwork", "leadership", "problem solving",
    "problem-solving", "critical thinking", "time management", "adaptability",
    "collaboration", "creativity", "attention to detail", "analytical",
    "organization", "presentation", "negotiation", "decision making",
    "conflict resolution", "mentoring", "project management", "self-motivated",
    "interpersonal", "multitasking", "stakeholder management",
]

CERTIFICATIONS = [
    "aws certified", "azure certified", "pmp", "scrum master", "csm",
    "comptia", "ccna", "ccnp", "google certified", "oracle certified",
    "microsoft certified", "six sigma", "itil", "cissp", "ceh",
    "certified kubernetes administrator", "cka", "terraform associate",
    "data science certificate", "ibm certified",
]

ACTION_VERBS_STRONG = [
    "led", "built", "designed", "architected", "developed", "implemented",
    "optimized", "automated", "launched", "spearheaded", "engineered",
    "streamlined", "delivered", "scaled", "reduced", "increased", "improved",
    "drove", "created", "established", "mentored", "orchestrated", "transformed",
]

ACTION_VERBS_WEAK = [
    "helped", "worked on", "responsible for", "involved in", "assisted",
    "participated", "did", "handled", "was part of",
]

ALL_SKILLS = (
    PROGRAMMING_LANGUAGES + FRAMEWORKS_LIBRARIES + DATABASES + CLOUD_DEVOPS
    + DATA_AI + TOOLS
)

SKILL_CATEGORIES = {
    "Programming Languages": PROGRAMMING_LANGUAGES,
    "Frameworks & Libraries": FRAMEWORKS_LIBRARIES,
    "Databases": DATABASES,
    "Cloud & DevOps": CLOUD_DEVOPS,
    "Data & AI": DATA_AI,
    "Tools & Platforms": TOOLS,
}
