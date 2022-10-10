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
  faCircleCheck,
  faCircleXmark,
  faXmark,
  faArrowRight,
  faPerson,
  faCircleDollarToSlot,
  faMoneyBillTransfer,
  faListCheck,
  faRotate,
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
library.add(faCircleCheck);
library.add(faCircleXmark);
library.add(faXmark);
library.add(faArrowRight);
library.add(faPerson);
library.add(faCircleDollarToSlot);
library.add(faMoneyBillTransfer);
library.add(faListCheck);
library.add(faRotate);

export default (app) => {
  app.component('fa-icon', FontAwesomeIcon);
};
