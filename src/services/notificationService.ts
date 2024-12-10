import { Appointment } from '../types/exam';
import { differenceInMinutes, addMinutes, format } from 'date-fns';

export const NOTIFICATION_TIMES = [
  { minutes: 24 * 60, label: '1 day before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 30, label: '30 minutes before' },
  { minutes: 15, label: '15 minutes before' },
];

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleAppointmentReminders = (appointment: Appointment) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  NOTIFICATION_TIMES.forEach(({ minutes }) => {
    const notificationTime = addMinutes(new Date(appointment.date), -minutes);
    const now = new Date();

    if (notificationTime > now) {
      const timeoutMs = notificationTime.getTime() - now.getTime();
      setTimeout(() => {
        new Notification(`Upcoming ${appointment.examType.toUpperCase()} Appointment`, {
          body: `Your appointment at ${appointment.imagingCenter} is in ${minutes} minutes.\nLocation: ${appointment.location}\nTime: ${format(appointment.date, 'PPp')}`,
          icon: '/notification-icon.png',
        });
      }, timeoutMs);
    }
  });
};