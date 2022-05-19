import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalize } from '../../lib/util';
import useSnapshot from '../../hooks/useSnapshot';
import ListItem from '../ListItem/ListItem';
import Layout from '../Layout/Layout';

export default function List() {
  const { token } = useParams();
  const { docs } = useSnapshot(token);
  const [userSearch, setUserSearch] = useState('');

  return (
    <Layout token={token}>
      {docs.length === 0 ? (
        <>
          <h2 className="text-blue-700">Your shopping list is currently empty</h2>
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
              .filter(({ item }) => {
                // 1) if search input is blank / empty
                // item will pass through filter
                //
                // 2) if search string is part of item name
                // item will pass through filter
                //
                // 3) otherwise item will be filtered out
                if (userSearch === '') {
                  return true;
                } else if (normalize(item).includes(normalize(userSearch))) {
                  return true;
                } else {
                  return false;
                }
              })
              .sort((a, b) => {
                if (a.purchaseFreq < b.purchaseFreq) return -1;
                if (a.purchaseFreq > b.purchaseFreq) return 1;
                return 0;
              })
              .map((doc) => (
                <ListItem key={doc.id} data={doc} token={token} />
              ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
