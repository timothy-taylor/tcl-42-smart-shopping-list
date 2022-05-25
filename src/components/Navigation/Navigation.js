import { NavLink } from 'react-router-dom';
import * as Icons from './Icons';

function StyledNavLink({ path, icon, text }) {
  const base = 'm-2 p-2 border-2 border-primary rounded-md';
  const active = 'text-secondary';
  const inactive =
    'font-normal text-white hover:border-secondary hover:text-secondary';

  return (
    <NavLink
      className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      to={path}
    >
      {icon} <span className="sr-only">{text}</span>
    </NavLink>
  );
}

export default function Navigation({ token }) {
  const darkMode = 'border-t-2 border-secondary';
  const containerStyle =
    'w-full fixed bottom-0 bg-primary flex items-center justify-center ' +
    darkMode;

  return (
    <nav className={containerStyle}>
      <StyledNavLink path={`/list/${token}`} icon={<Icons.List />} text='list' />
      <StyledNavLink path={`/addItem/${token}`} icon={<Icons.AddItem />} text='add item'/>
    </nav>
  );
}
