
import { CalendarEvent, ParentReport, UserProfile } from "../../core/types";

export type ActivityPriority = "LOW" | "MEDIUM" | "HIGH";

export interface AgendaActivity {
  id: string;
  date: string; // ISO YYYY-MM-DD
  name: string;
  time: string; // HH:mm
  icon: string; // Emoji string
  isCustom: boolean;
  alertEnabled: boolean;
  alertOffsetMinutes?: number;
  priority: ActivityPriority;
}

export interface AgendaModuleProps {
  events: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  reports: ParentReport[];
  profile: UserProfile;
}

export interface PredefinedActivity {
  name: string;
  icon: string;
  defaultTime: string;
}
