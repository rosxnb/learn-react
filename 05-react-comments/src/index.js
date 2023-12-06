import React from 'react';
import ReactDOM from 'react-dom/client';


function Reply({ text, replies }) {
  return (
    <div style={{borderLeft: '1px solid grey', padding: '10px', marginLeft: '5px'}}>
      <p>{text}</p>
      { replies &&  replies.map( (r, i) => <Reply key={i} {...r} /> ) }
    </div>
  );
}


function Comment({ text, replies }) {
  return (
    <div style={{padding: '10px', marginLeft: '5px'}}>
      <p>{text}</p>
      { replies && replies.map( (r, i) => <Reply key={i} {...r} /> ) }
    </div>
  );
}


function App() {
  const comments = [
    {
      text: 'This is reply 1.',
      replies: [
        {
          text: 'This is reply to reply 1.',
        },
        {
          text: 'This is another reply to reply 1.',
          replies: [
            {
              text: 'This is reply to second reply of reply 1.',
            },
          ],
        },
      ],
    },
    {
      text: 'This is reply 2',
    },
  ];

  return (
    <div>
      { comments.map( (comment, idx) => <Comment key={idx} {...comment} /> ) }
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
