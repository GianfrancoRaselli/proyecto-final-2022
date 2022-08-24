<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        class="notification"
        :class="`notification-type-${notification.type}`"
        v-for="notification in notifications"
        :key="notification.id"
      >
        <span>{{ notification.message }}</span>
        <button
          type="button"
          class="btn btn-secondary"
          @click="removeNotification(notification.id)"
        >
          X
        </button>
      </div>
      <button
        type="button"
        class="btn btn-link btn-remove-all"
        @click="removeNotifications"
        v-if="notifications.length > 0"
      >
        Remove all
      </button>
    </transition-group>
  </div>
</template>

<script>
import {
  notifications,
  removeNotification,
  removeNotifications,
} from "@/composables/useNotifications";

export default {
  name: "AppNotificaionsComponent",
  setup() {
    return { notifications, removeNotification, removeNotifications };
  },
};
</script>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}

.notification {
  background: rgb(240, 240, 240);
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rbga(0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
  border-radius: 5px;
}

.notification.notification-type-success {
  border-left: 5px solid rgb(15, 109, 38);
}

.notification.notification-type-error {
  border-left: 5px solid rgb(146, 5, 5);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.8s ease;
}

.btn-remove-all {
  float: right;
}
</style>
