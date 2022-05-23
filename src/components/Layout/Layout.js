import Navigation from '../Navigation/Navigation';
import Header, { centeredBox } from '../Header/Header';

export default function Layout({ token, children }) {
  return (
    <>
      <Header text="Smart Shopping List" />
      <Navigation token={token} />
      <main className={`${centeredBox} pb-24`}>{children}</main>
    </>
  );
}
