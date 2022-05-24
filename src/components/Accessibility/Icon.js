export default function IconText({ text }) {
  return (
    <span className="inline-block absolute overflow-hidden h-px w-px -m-px">
      {text}
    </span>
  );
}
