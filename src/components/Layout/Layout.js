import Navigation from '../Navigation/Navigation';

export const centeredBox = 'max-w-md mx-auto';
export const Header = ({ text }) => (
  <h1
    className={`${centeredBox} p-4 text-primary dark:text-white text-center text-2xl`}
  >
    {text}
  </h1>
);

export default function Layout({ token, children }) {
  return (
    <>
      <Header text="Smart Shopping List" />
      <Navigation token={token} />
      <main className={`${centeredBox} pb-24`}>{children}</main>
    </>
  );
}
