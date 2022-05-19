import Navigation from '../Navigation/Navigation';

export default function Layout({ token, children }) {
  return (
    <div className="">
      <h1 className="p-4 text-primary text-5xl">Smart Shopping List</h1>
      <Navigation token={token} />
      <main>{children}</main>
    </div>
  );
}
