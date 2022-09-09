import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGlobe,
  faCheck,
  faWallet,
  faCircleInfo,
  faCircleExclamation,
  faTriangleExclamation,
  faCopy,
  faArrowUpRightFromSquare,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';

library.add(faGlobe);
library.add(faCheck);
library.add(faWallet);
library.add(faCircleInfo);
library.add(faCircleExclamation);
library.add(faTriangleExclamation);
library.add(faCopy);
library.add(faArrowUpRightFromSquare);
library.add(faCircle);

export default (app) => {
  app.component('fa-icon', FontAwesomeIcon);
};
