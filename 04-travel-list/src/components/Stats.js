export default function Stats({ items }) {
  const nItems = items.length;
  const nPacked = items.reduce( (acc, item) => acc + Number(item.packed), 0 );
  const percentage = Math.round(nPacked / nItems * 100);

  return (
    <footer className='stats'>
      <em>💼 You have {nItems} items on your list, and you already packed {nPacked} ({percentage}%)</em>
    </footer>
  );
}

