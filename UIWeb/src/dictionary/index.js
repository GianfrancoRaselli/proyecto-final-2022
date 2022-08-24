import store from '@/store';
import messages from "@/dictionary/messages.json";

const getMessage = message => {
  return messages[message][store.state.config.selectedLanguage];
};

const getMessages = (messages) => {
  const methods = {};
  if (messages && messages.length > 0) {
    for (let i = 0; messages.length > i; i++) {
      methods[messages[i] + "Msg"] = () => getMessage(messages[i]);
    }
  }
  return methods;
};

export { getMessages };
