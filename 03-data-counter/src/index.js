import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const day = new Date();
  day.setDate(day.getDate() + count);

  function handleStepDecrease() {
    if (step > 1)
    setStep(step => step - 1);
  }

  function handleStepIncrease() {
    setStep(step => step + 1);
  }

  function handleTimesDecrease() {
    setCount(count => count - step);
  }

  function handleTimesIncrease() {
    setCount(count => count + step);
  }

  return (
    <div>
      <div>
        <button onClick={handleStepDecrease}>
          <span> - </span>
        </button>

        <span>Step: {step} </span>

        <button onClick={handleStepIncrease}>
          <span> + </span>
        </button>
      </div>

      <div>
        <button onClick={handleTimesDecrease}>
          <span> - </span>
        </button>

        <span>Count: {count}</span>

        <button onClick={handleTimesIncrease}>
          <span> + </span>
        </button>
      </div>

      <p>
        <span>{count === 0 ? 'Today is ' : count > 0 ? `${count} days from today is ` : `${-1 * count} days ago was `}</span>
        <span>{day.toDateString()}</span>
      </p>
    </div>
  );
}

