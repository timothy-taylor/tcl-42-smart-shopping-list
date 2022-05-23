export const centeredBox = 'max-w-md mx-auto';
export default function Header({ text }) {
  return (
    <h1
      className={`${centeredBox} p-4 text-primary dark:text-white text-center text-2xl`}
    >
      {text}
    </h1>
  );
}
