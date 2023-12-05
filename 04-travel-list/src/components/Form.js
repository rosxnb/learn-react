import { useState } from "react";

export default function Form({ onAddItem }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false
    };

    onAddItem(newItem);

    setDescription('');
    setQuantity(1);
  }

  function handleInputChange(e) {
    setDescription(e.target.value);
  }

  function handleQuantityChange(e) {
    setQuantity(Number(e.target.value));
  }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>

      <select onChange={handleQuantityChange} value={quantity} >
        { Array.from({ length: 20}, (_, idx) => idx + 1).map
        (num => (
          <option value={num} key={num}>
            {num}
          </option>
        )) }
      </select>

      <input type='text' placeholder='Item...' onChange={handleInputChange} value={description} />
      <button>Add</button>
    </form>
  );
}
