import { NavLink } from 'react-router-dom';

const Add = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const List = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

function StyledNavLink({ path, text }) {
  const base = 'p-4';
  const active = 'text-neutral font-bold';
  const inactive = 'font-normal text-white hover:text-neutral';

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
    <nav className="w-full fixed bottom-0 py-8 bg-primary flex items-center justify-center">
      <StyledNavLink path={`/list/${token}`} text={<List />} />
      <StyledNavLink path={`/addItem/${token}`} text={<Add />} />
    </nav>
  );
}
