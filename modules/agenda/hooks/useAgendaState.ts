
import { useState, useEffect, useMemo } from "react";
import { AgendaActivity } from "../types";
import { agendaStorage } from "../services/agendaStorage";
import { mimiEvents } from "../../../core/events";

export const useAgendaState = (selectedDate: string) => {
  const [activities, setActivities] = useState<AgendaActivity[]>(() => agendaStorage.getActivities());

  useEffect(() => {
    agendaStorage.saveActivities(activities);
  }, [activities]);

  const dailyActivities = useMemo(() => {
    return activities
      .filter(a => a.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [activities, selectedDate]);

  const addActivity = (activity: Omit<AgendaActivity, "id">) => {
    const newActivity = { ...activity, id: `act_${Date.now()}` };
    setActivities(prev => [...prev, newActivity]);
    mimiEvents.dispatch("AGENDA_ACTIVITY_CREATED", newActivity);
  };

  const updateActivity = (updated: AgendaActivity) => {
    setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    mimiEvents.dispatch("AGENDA_ACTIVITY_UPDATED", updated);
  };

  const removeActivity = (id: string) => {
    const activityToRemove = activities.find(a => a.id === id);
    setActivities(prev => prev.filter(a => a.id !== id));
    if (activityToRemove) {
      mimiEvents.dispatch("AGENDA_ACTIVITY_DELETED", activityToRemove);
    }
  };

  const toggleAlert = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const updated = { ...activity, alertEnabled: !activity.alertEnabled };
      updateActivity(updated);
    }
  };

  return {
    activities,
    dailyActivities,
    addActivity,
    updateActivity,
    removeActivity,
    toggleAlert
  };
};
