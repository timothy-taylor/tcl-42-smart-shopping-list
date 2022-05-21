import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { normalize } from '../../lib/util';
import useSnapshot from '../../hooks/useSnapshot';
import ListItem from '../ListItem/ListItem';
import Layout from '../Layout/Layout';

const EmptyList = ({ token }) => (
  <div className="flex flex-col items-center justify-center">
    <h2 className="font-serif text-xl p-8">
      Your shopping list is currently empty
    </h2>
    <Link to={`/addItem/${token}`}>
      <button className="border-2 p-2 rounded-md border-secondary text-secondary hover:bg-secondary hover:text-white">
        Add Item
      </button>
    </Link>
  </div>
);

const FilterInput = ({ userSearch, setUserSearch }) => (
  <div className="flex justify-center items-center">
    <input
      className="border-neutral focus:border-primary"
      type="text"
      placeholder="Filter items"
      aria-label="Filter items"
      value={userSearch}
      onChange={(e) => setUserSearch(e.target.value)}
    />
    <button
      type="button"
      className="p-1 text-secondary hover:text-primary"
      tabIndex="0"
      aria-label="Clear filter input"
      onClick={() => setUserSearch('')}
    >
      X
    </button>
  </div>
);

export default function List() {
  const { token } = useParams();
  const { docs } = useSnapshot(token);
  const [userSearch, setUserSearch] = useState('');

  return (
    <Layout token={token}>
      {docs.length === 0 ? (
        <EmptyList token={token} />
      ) : (
        <>
          <FilterInput {...{ userSearch, setUserSearch }} />
          <ul className="m-8">
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
