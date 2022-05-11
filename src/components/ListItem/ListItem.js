import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { DAY_IN_MILLISEC } from '../../lib/util';

const SOON = 7;
const KIND_OF_SOON = 14;

function isInactive(totalPurchases, purchaseDate, estimatedNextPurchaseDate) {
  if (totalPurchases < 2) return true;
  const date = new Date(purchaseDate);
  const timeElapsed = date.getTime() - Date.now();
  const estiDate = new Date(estimatedNextPurchaseDate);
  const comparison = timeElapsed * 2 > estiDate.getTime();

  return comparison;
}

function styleCheckbox(item) {
  const inactive = isInactive(
    item.totalPurchases,
    item.purchaseDate,
    item.estimatedNextPurchaseDate,
  );
  if (inactive) return 'black';
  if (item.purchaseFreq <= SOON) return 'green';
  if (item.purchaseFreq <= KIND_OF_SOON) return 'orange';
  return 'red';
}

function accessibilityLabel(item) {
  const inactive = isInactive(
    item.totalPurchases,
    item.purchaseDate,
    item.estimatedNextPurchaseDate,
  );
  if (inactive) return 'not purchase';
  if (item.purchaseFreq <= SOON) return 'purchase in less than 7 days';
  if (item.purchaseFreq <= KIND_OF_SOON) return 'purchase in less than 14 days';
  return 'purchase in 30 days';
}

export const daysSincePurchase = (datePurchaseInMilli, dateCreatedInMilli) => {
  const workingTimestamp = datePurchaseInMilli || dateCreatedInMilli;

  const differenceInMilli = Date.now() - workingTimestamp;
  return differenceInMilli / DAY_IN_MILLISEC;
};

function getPurchaseDates(estimateInDays) {
  const purchaseDate = new Date();
  const estimatedNextPurchaseDate = new Date(
    purchaseDate.getTime() + estimateInDays * DAY_IN_MILLISEC,
  );

  return [purchaseDate, estimatedNextPurchaseDate];
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

export default function ListItem({ commodity, token }) {
  async function undoPurchase(id) {
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
    <li key={commodity.id}>
      <input
        key={`checkbox-${commodity.id}`}
        type="checkbox"
        checked={commodity.checked}
        onChange={() =>
          commodity.checked
            ? undoPurchase(commodity.id)
            : updatePurchase(commodity)
        }
      />
      <span
        key={`item-${commodity.id}`}
        aria-label={accessibilityLabel(commodity)}
        style={{
          color: styleCheckbox(commodity),
        }}
      >
        {commodity.item}
      </span>
    </li>
  );
}
