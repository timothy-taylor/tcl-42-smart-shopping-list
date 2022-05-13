import { doc, updateDoc } from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { db } from '../../lib/firebase';
import { DAY_IN_MILLISEC } from '../../lib/util';

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

  if (inactive) return 'black';
  if (item.purchaseFreq <= SOON) return 'green';
  if (item.purchaseFreq <= KINDA_SOON) return 'orange';
  return 'red';
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

  return (
    <li>
      <input
        type="checkbox"
        checked={data.checked}
        onChange={() =>
          data.checked ? undoPurchase(data) : updatePurchase(data)
        }
      />
      <span
        aria-label={accessibilityLabel(data)}
        style={{ color: itemStyle(data) }}
      >
        {data.item}
      </span>
    </li>
  );
}
