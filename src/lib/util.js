export const DAY_IN_MILLISEC = 86400000;
export const parseToken = (token) => token.replace(/\s+/g, '-');
export const normalize = (str) => str.toLowerCase().replace(/[^\w\s]|_/g, '');
export const buttonStyles =
  'w-full p-2 rounded-md border-2 border-secondary font-bold text-secondary hover:text-white hover:bg-secondary';

/**
 * Calculate a weighted estimate for the interval of days until the next purchase.
 * Current purchase a tiny bit less weight than all previous purchases
 *
 * This is a copy of https://github.com/the-collab-lab/shopping-list-utils
 * except
 * this function returns previousEstimate rather than daysSinceLastTransaction
 */
export const calculateEstimate = (
  previousEstimate, // The last estimated purchase interval
  daysSinceLastTransaction, // The number of days since the item was added to the list or last purchased
  totalPurchases // Total number of purchases for the item
) => {
  // Not enough data if an item has been purchased 1 time,
  // just set the estimate based on when it was added to the list
  if (totalPurchases < 2) return previousEstimate;

  // This calculates how many days should have passed based on
  // the previous estimate between purchases and the total number of purchased
  const previousFactor = previousEstimate * totalPurchases;

  // This calculates how many days should have passed based on
  // the interval between the most recent transactions
  // Subtract 1 here to exclude the current purchase in this factor
  const latestFactor = daysSinceLastTransaction * (totalPurchases - 1);

  // Divisor is used to find the average between the two factors
  // Multiplied by 2 between we will add 2 factors together
  // Subtract 1 here to lower weight of the current purchase in this factor
  const totalDivisor = totalPurchases * 2 - 1;

  //Calculate the average interval between the previous factor and the latest factor
  return Math.round((previousFactor + latestFactor) / totalDivisor);
};
