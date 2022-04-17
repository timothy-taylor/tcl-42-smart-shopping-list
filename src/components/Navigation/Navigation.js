import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ token }) => {
  return (
    <nav className="navigation">
      <NavLink
        to={`/list/${token}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          padding: '4px',
        })}
      >
        List
      </NavLink>
      <NavLink
        to={`/addItem/${token}`}
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
