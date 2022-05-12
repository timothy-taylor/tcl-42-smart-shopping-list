import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalize } from '../../lib/util';
import useSnapshot from '../../hooks/useSnapshot';
import Navigation from '../Navigation/Navigation';
import ListItem from '../ListItem/ListItem';

export default function List() {
  const { token } = useParams();
  const { docs } = useSnapshot(token);
  const [userSearch, setUserSearch] = useState('');

  return (
    <>
      <h1>Smart Shopping List</h1>
      <Navigation token={token} />
      {docs.length === 0 ? (
        <>
          <h2>Your shopping list is currently empty</h2>
          <Link to={`/addItem/${token}`}>
            <button>Add Item</button>
          </Link>
        </>
      ) : (
        <>
          <label>
            Filter items
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </label>
          <button
            aria-label="Clear filter input"
            onClick={() => setUserSearch('')}
          >
            X
          </button>
          <ul style={{ listStyle: 'none' }}>
            {docs
              .filter(
                ({ item }) =>
                  // 1) if search input is blank / empty
                  // item will pass through filter
                  //
                  // 2) if search string is part of item name
                  // item will pass through filter
                  //
                  // 3) otherwise item will be filtered out
                  userSearch === '' ||
                  normalize(item).includes(normalize(userSearch)),
              )
              .sort((a, b) => {
                if (a.purchaseFreq < b.purchaseFreq) return -1;
                if (a.purchaseFreq > b.purchaseFreq) return 1;
                return 0;
              })
              .map((doc) => (
                <ListItem data={doc} token={token} />
              ))}
          </ul>
        </>
      )}
    </>
  );
}
