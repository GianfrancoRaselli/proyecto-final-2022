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
  faPlus,
  faList,
  faMoneyBill,
  faTrash,
  faArrowLeft,
  faSquareArrowUpRight,
  faThumbsUp,
  faFilter,
  faMagnifyingGlass,
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
library.add(faPlus);
library.add(faList);
library.add(faMoneyBill);
library.add(faTrash);
library.add(faArrowLeft);
library.add(faSquareArrowUpRight);
library.add(faThumbsUp);
library.add(faFilter);
library.add(faMagnifyingGlass);

export default (app) => {
  app.component('fa-icon', FontAwesomeIcon);
};
