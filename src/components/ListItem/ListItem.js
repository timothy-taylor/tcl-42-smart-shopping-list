import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { db } from '../../lib/firebase';
import { DAY_IN_MILLISEC } from '../../lib/util';
import * as Icons from './Icons';

const SOON = 7;
const KINDA_SOON = 14;

function isInactive(totalPurchases, purchaseDate, estimatedNextPurchaseDate) {
  if (totalPurchases < 2) return true;

  const timeElapsed = new Date(purchaseDate).getTime() - Date.now();
  const estiDate = new Date(estimatedNextPurchaseDate);
  const isElapsed = timeElapsed * 2 > estiDate.getTime();

  return isElapsed;
}

function itemStyle(item) {
  const inactive = isInactive(
    item.totalPurchases,
    item.purchaseDate,
    item.estimatedNextPurchaseDate,
  );

  // returns tailwind styles
  if (inactive) return 'border-gray-300 hover:text-gray-600 dark:hover:text-gray-300';
  if (item.purchaseFreq <= SOON) return 'border-soon hover:text-soon';
  if (item.purchaseFreq <= KINDA_SOON)
    return 'border-kinda-soon hover:text-kinda-soon';
  return 'border-not-soon hover:text-not-soon';
}

function accessibilityLabel(item) {
  const inactive = isInactive(
    item.totalPurchases,
    item.purchaseDate,
    item.estimatedNextPurchaseDate,
  );

  if (inactive) return 'item has not been purchased recently';
  if (item.purchaseFreq <= SOON) return 'purchase in less than 7 days';
  if (item.purchaseFreq <= KINDA_SOON) return 'purchase in less than 14 days';
  return 'purchase in 30 days';
}

export function daysSincePurchase(datePurchaseInMilli, dateCreatedInMilli) {
  const workingTimestamp = datePurchaseInMilli || dateCreatedInMilli;

  const millisecSincePurchase = Date.now() - workingTimestamp;
  return millisecSincePurchase / DAY_IN_MILLISEC;
}

function getPurchaseData(item) {
  const totalPurchases = item.totalPurchases + 1;
  const purchaseFreq = calculateEstimate(
    item.purchaseFreq,
    daysSincePurchase(item.purchaseDate?.toMillis(), item.createdAt.toMillis()),
    totalPurchases,
  );

  return [totalPurchases, purchaseFreq];
}

function getPurchaseDates(estimateInDays) {
  const purchaseDate = new Date();
  const estimatedNextPurchaseDate = new Date(
    purchaseDate.getTime() + estimateInDays * DAY_IN_MILLISEC,
  );

  return [purchaseDate, estimatedNextPurchaseDate];
}

//
//
// this component is used inside of the map function in <List />
export default function ListItem({ data, token }) {
  async function undoPurchase({ id }) {
    await updateDoc(doc(db, token, id), {
      purchaseDate: null,
      estimatedNextPurchaseDate: null,
    });
  }

  async function updatePurchase(item) {
    const [totalPurchases, purchaseFreq] = getPurchaseData(item);
    const [purchaseDate, estimatedNextPurchaseDate] =
      getPurchaseDates(purchaseFreq);

    await updateDoc(doc(db, token, item.id), {
      purchaseDate,
      totalPurchases,
      purchaseFreq,
      estimatedNextPurchaseDate,
    });
  }

  async function deleteItem(id) {
    if (window.confirm('Are you sure you want to delete item?')) {
      await deleteDoc(doc(db, token, id));
    }
  }
  
  const containerStyle =
    'bg-white flex justify-between items-center p-2 my-4 box-border rounded-sm border-2 border-l-8 ' +
    itemStyle(data) + ' dark:bg-primary dark:text-white';

  return (
    <li className={containerStyle}>
      <input
        className="text-secondary dark:text-neutral hover:cursor-pointer hover:focus:text-primary"
        type="checkbox"
        checked={data.checked}
        onChange={() =>
          data.checked ? undoPurchase(data) : updatePurchase(data)
        }
      />
      <span
        className="p-2 font-serif text-lg"
        aria-label={accessibilityLabel(data)}
      >
        {data.item}
      </span>
      <button
        className="rounded-md text-secondary dark:text-neutral text-sm p-2 hover:bg-secondary hover:text-white dark:hover:bg-neutral"
        onClick={() => deleteItem(data.id)}
      >
        <Icons.Delete />
      </button>
    </li>
  );
}
