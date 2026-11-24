export type SpeciesType = "Cão" | "Gato" | "Ave" | "Coelho" | "Roedor" | "Peixe";

export type UserRoleOption = "Pet Sitter" | "Tutor" | "Pet Sitter e Tutor";

export type ActiveView =
  | "home"
  | "logged-home"
  | "workspace"
  | "my-pets"
  | "chat"
  | "course"
  | "profile";

export interface ObservationEntry {
  id: string;
  text: string;
  createdAt: string;
}

export interface PetProfile {
  id: string;
  name: string;
  species: SpeciesType;
  ageOrNotes: string;
  observations: ObservationEntry[];
}

export interface ServiceListing {
  id: string;
  title: string;
  species: SpeciesType;
  modality: string;
  city: string;
  rateLabel: string;
  rating: number;
  summary: string;
  checklist: string[];
  observations: ObservationEntry[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  flagged?: boolean;
}

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  duration: string;
  objective: string;
  syllabus: string[];
  practicalChecklist: string[];
  assessmentQuestion: string;
  options: string[];
  correctIndex: number;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  role: UserRoleOption;
  maskContactUntilConfirmation: boolean;
  bio: string;
}