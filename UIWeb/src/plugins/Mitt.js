import mitt from 'mitt';

export default (app) => {
  app.config.globalProperties.emitter = mitt();
};
