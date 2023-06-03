export function Button(props) {
  const { onClick,children } = props;
  return (
    <button
      className="p-2 border rounded-lg transition hover:bg-slate-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
