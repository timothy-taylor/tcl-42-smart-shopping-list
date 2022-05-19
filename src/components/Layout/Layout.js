import Navigation from '../Navigation/Navigation';

export default function Layout({ token, children }) {
  return (
    <div>
      <h1>Smart Shopping List</h1>
      <Navigation token={token} />
      <main>{children}</main>
    </div>
  );
}
