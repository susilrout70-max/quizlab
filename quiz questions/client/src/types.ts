export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type Difficulty = 'easy' | 'medium' | 'difficult';

export interface QuizQuestion {
  position: number;
  question_text: string;
  options: string[];
}

export interface QuizAttemptStartResponse {
  attempt_id: string;
  subject: string;
  difficulty: Difficulty;
  total_questions: number;
  is_reattempt: boolean;
  questions: QuizQuestion[];
}

export interface ReviewedQuestion {
  position: number;
  question_text: string;
  options: string[];
  selected_option: number | null;
  correct_option: number;
  is_correct: boolean;
  explanation: string;
}

export interface QuizSubmitResponse {
  message: string;
  attempt_id: string;
  subject: string;
  difficulty: Difficulty;
  score: number;
  total_questions: number;
  percentage: number;
  is_reattempt: boolean;
  questions: ReviewedQuestion[];
}

export interface PastAttempt {
  id: string;
  subject: string;
  difficulty: Difficulty;
  score: number;
  total_questions: number;
  percentage: number;
  status: string;
  started_at: string;
  completed_at: string;
  is_reattempt: boolean;
  original_attempt_id: string | null;
}

export interface SubjectStat {
  subject: string;
  attempts: number;
  avg_percentage: number;
  best_percentage: number;
  total_score: number;
  total_questions: number;
}

export interface DifficultyStat {
  difficulty: Difficulty;
  attempts: number;
  avg_percentage: number;
}

export interface QuizAnalytics {
  total_quizzes: number;
  average_percentage: number;
  total_questions: number;
  total_correct: number;
  subject_stats: SubjectStat[];
  difficulty_stats: DifficultyStat[];
}
