export type EventType = 'wedding' | 'birthday' | 'community';

export type ContributorRole = 'host' | 'co_planner' | 'contributor' | 'guest';

export interface Contributor {
  id: string;
  name: string;
  email: string;
  role: ContributorRole;
  avatar: string;
  isOnline: boolean;
  assignedTasksCount: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  allocated: number;
  actual: number;
  status: 'unpaid' | 'deposit_paid' | 'paid';
  assignedTo?: string;
  notes?: string;
}

export interface TimelineItem {
  id: string;
  timeframe: string;
  title: string;
  description: string;
  phase: 'milestone' | 'day_of';
  time?: string;
  completed: boolean;
  assignedTo?: string;
  location?: string;
}

export interface Vendor {
  id: string;
  category: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'researching' | 'contacted' | 'quoted' | 'contract_signed' | 'confirmed';
  fee: number;
  depositDue?: string;
  questions: string[];
  notes: string;
  website?: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
  role: string;
}

export interface SignatureDrink {
  name: string;
  ingredients: string;
  story: string;
}

export interface PersonalizedIdeas {
  signatureDrinks: SignatureDrink[];
  invitationWording: string;
  acousticPlaylist: string[];
  guestFavors: string;
  decorTouches?: string[];
}

export interface ContributorTask {
  id: string;
  title: string;
  category: string;
  assignedToName?: string;
  status: 'open' | 'claimed' | 'completed';
  dueDate?: string;
  notes?: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'budget' | 'timeline' | 'vendor' | 'task' | 'general';
}

export interface DiscussionNote {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface EventPlan {
  id: string;
  eventType: EventType;
  title: string;
  tagline: string;
  vibe: string;
  location: string;
  date: string;
  guestCount: number;
  targetBudget: number;
  currency: string;
  palette: PaletteColor[];
  budgetItems: BudgetItem[];
  timeline: TimelineItem[];
  vendors: Vendor[];
  personalizedIdeas: PersonalizedIdeas;
  contributors: Contributor[];
  contributorTasks: ContributorTask[];
  activityLog: ActivityLogItem[];
  discussionNotes: DiscussionNote[];
}
