import { reactive } from 'vue';

const notifications = reactive([]);

const addNotification = ({ message, timeout = 15000, type = 'info' }) => {
  const id = Math.random() + Date.now();
  notifications.push({ id, message, type });
  if (timeout) {
    const removeNotificationSubscription = setTimeout(() => {
      removeNotification(id);
      clearTimeout(removeNotificationSubscription);
    }, timeout);
  }
};

const removeNotification = (id) => {
  const index = notifications.findIndex((item) => item.id === id);
  notifications.splice(index, 1);
};

const removeNotifications = () => {
  notifications.splice(0);
};

export { notifications, addNotification, removeNotification, removeNotifications };
