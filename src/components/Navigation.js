import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const styles = {
    position: 'fixed',
    bottom: 100,
    left: 0,
    width: '100%',
    textAlign: 'center',
  };

  return (
    <nav style={styles}>
      <NavLink
        to="/"
        style={({isActive}) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          padding: '4px',
        })}
      >
        List
      </NavLink>
      <NavLink
        to="/addItem"
        style={({isActive}) => ({
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
