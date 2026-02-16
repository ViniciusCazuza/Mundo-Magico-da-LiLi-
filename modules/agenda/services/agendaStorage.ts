
import { AgendaActivity } from "../types";

const STORAGE_KEY = "mimi_agenda_v1";

export const agendaStorage = {
  getActivities: (): AgendaActivity[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveActivities: (activities: AgendaActivity[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }
};
