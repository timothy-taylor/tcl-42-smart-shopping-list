import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink
        to="/"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          padding: '4px',
        })}
      >
        List
      </NavLink>
      <NavLink
        to="/addItem"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          padding: '4px',
        })}
      >
        Add Item
      </NavLink>
    </nav>
  );
};

export default Navigation;
