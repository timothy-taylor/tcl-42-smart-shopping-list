import * as Icons from './Icons';

export default function ErrorMessage({ error, id }) {
  return (
    <div id={id} className="mt-5 text-red-600 flex justify-center">
      <Icons.Warning />
      {error}
    </div>
  );
}
