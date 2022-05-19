import { NavLink } from 'react-router-dom';

function StyledNavLink({ path, text }) {
  const base = 'p-2 text-white';
  const active = 'font-bold';
  const inactive ='font-normal';

  return (
    <NavLink
      className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      to={path}
    >
      {text}
    </NavLink>
  );
}

export default function Navigation({ token }) {
  return (
    <nav className="w-full fixed bottom-0 py-8 bg-primary text-center">
      <StyledNavLink path={`/list/${token}`} text="List" />
      <StyledNavLink path={`/addItem/${token}`} text="Add Item" />
    </nav>
  );
}
