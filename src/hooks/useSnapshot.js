import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DAY_IN_MILLISEC } from '../lib/util';

export const isLessThan24HoursOld = (datePurchaseInMilli) => {
  if (!datePurchaseInMilli) return false;

  const timeElapsed = Date.now() - datePurchaseInMilli;
  return timeElapsed < DAY_IN_MILLISEC;
};

export default function useSnapshot(token) {
  const [isLoading, setIsLoading] = useState(true);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    let unsubscribe;
    
    if (token){
      const q = query(collection(db, token), orderBy("item"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        setDocs(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              checked: isLessThan24HoursOld(data.purchaseDate?.toMillis()),
              ...data,
            };
          }),
        );
        setIsLoading(false);
      });
    }

    return unsubscribe;
  }, [token]);
  
  return { docs, isLoading };
}
