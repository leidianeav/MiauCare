export type NavPage =
  | "home"
  | "workspace"
  | "pets"
  | "chat"
  | "course"
  | "profile";

export type AuthModalMode = "login" | "register" | null;

export type FontScale = "normal" | "lg" | "xl";

export type SingularSpecies =
  | "Cão"
  | "Gato"
  | "Ave"
  | "Coelho"
  | "Roedor"
  | "Peixe";

export type PetCategoryPlural =
  | "Aves"
  | "Cães"
  | "Coelhos"
  | "Gatos"
  | "Peixes"
  | "Roedores";

export interface UserProfile {
  name: string;
  email: string;
  verified: boolean;
  phone: string;
  age: number;
  profileImg: string;
  hideContactUntilBooking?: boolean;
}

export interface PetItem {
  id: number;
  name: string;
  species: PetCategoryPlural | string;
  breed: string;
  age: string;
  specialCare: string;
  photo?: string;
}

export interface ChecklistTask {
  id: number;
  text: string;
  cat: string;
  done: boolean;
  doneAt?: string;
}

export interface ChatMessageMedia {
  type: "image" | "video";
  url: string;
  name: string;
}

export interface JobMessage {
  id: number;
  author: string;
  authorEmail: string;
  text?: string;
  media?: ChatMessageMedia;
  timestamp: string;
  hidden: boolean;
}

export interface CareJob {
  id: number;
  petName: string;
  petSpecies: SingularSpecies | string;
  petBreed: string;
  tutor: string;
  tutorEmail: string;
  tutorPhone: string;
  petsitter: string;
  petsitterEmail: string;
  petsitterPhone: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed";
  tasks: ChecklistTask[];
  messages: JobMessage[];
  notes: string;
  entryTime: string;
  exitTime: string;
}

export interface CourseProgress {
  done: number[];
  examScore: number | null;
  examPassed: boolean;
  authCode: string | null;
  completedAt: string | null;
}

export interface ModerationResult {
  ok: boolean;
  reason?: string;
}
