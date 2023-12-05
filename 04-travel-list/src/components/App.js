import { useState } from "react";
import Logo from './Logo';
import Form from './Form';
import PackingList from "./PackingList";
import Stats from "./Stats";


export default function App() {
  const [items, setItems] = useState([])

  function handleAddItem(item) {
    setItems(items => [...items, item]);
  }

  function handleDeleteItem(item) {
    setItems(items => items.filter( ({id}) => id !== item.id ) );
  }

  function handleToggleItem(id) {
    setItems(items => items.map( item => item.id === id ? { ...item, packed: !item.packed } : item ));
  }

  function handleClearList() {
    const confirmed = window.confirm('You asked to clear the list. Do you wish to continue?');
    if (confirmed) setItems([]);
  }

  return (
    <div className='app'>
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList items={items}  onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} onClearList={handleClearList} />
      <Stats items={items} />
    </div>
  );
}

