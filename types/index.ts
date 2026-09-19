// Types principaux de Mon Compagnon

export type IdeaStatus = 'nouvelle' | 'a_developper' | 'en_cours' | 'utilisee' | 'abandonnee' | 'a_revoir';

export type CompanionMode =
  | 'compagnon'
  | 'ecriture'
  | 'archiviste'
  | 'personnage'
  | 'univers'
  | 'brainstorming'
  | 'coherence';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  age?: string;
  appearance?: string;
  personality?: string;
  history?: string;
  relations?: string;
  fears?: string;
  goals?: string;
  secrets?: string;
  powers?: string;
  evolution?: string;
  notes?: string;
  customFields?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface WorldElement {
  id: string;
  projectId: string;
  type: 'monde' | 'royaume' | 'ville' | 'maison' | 'ecole' | 'creature' | 'objet' | 'magie' | 'technologie' | 'religion' | 'regle' | 'evenement' | 'autre';
  name: string;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  projectId?: string; // null = idée globale
  title: string;
  description?: string;
  category?: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood?: string;
  events?: string;
  ideas?: string;
  goals?: string;
  memories?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category?: string; // préférences, habitudes, projets, etc.
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Draft {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: 'brouillon' | 'scene' | 'chapitre' | 'dialogue' | 'note';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'companion';
  content: string;
  mode: CompanionMode;
  projectId?: string;
  characterId?: string; // si mode personnage
  createdAt: string;
}

export interface CompanionSettings {
  name: string;
  personality: string;
  speakingStyle: string;
  familiarityLevel: number; // 1-5
  theme: 'clair' | 'sombre' | 'auto';
  primaryColor: string;
  textSize: 'petit' | 'moyen' | 'grand';
}
