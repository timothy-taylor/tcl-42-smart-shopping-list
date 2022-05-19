import { NavLink } from 'react-router-dom';
import './Navigation.css';

function StyledNavLink({ path, text }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        padding: '4px',
      })}
    >
      {text}
    </NavLink>
  );
}

export default function Navigation({ token }) {
  return (
    <nav className="navigation">
      <StyledNavLink path={`/list/${token}`} text="List" />
      <StyledNavLink path={`/addItem/${token}`} text="Add Item" />
    </nav>
  );
};
