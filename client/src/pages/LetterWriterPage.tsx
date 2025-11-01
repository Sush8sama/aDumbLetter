import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LetterWriterPage(user) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');


    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:3001/letters/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ content, title, user}),
            credentials: 'same-origin', // can set to 'include' if needed
        });
            if (!response.ok) {
                throw new Error('saving letter failed, status: ' + response.status + response.statusText);
            }
            const data = await response.json();
            setMessage(data);
        } catch (error) {
            setMessage('Error saving the letter.');
            console.error('There was an error saving the letter:', error);
        }
    };


    return (
        <div>
      <h1>Letter Writer</h1>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="letter-title" style={{ display: 'block', fontWeight: 600 }}>
          Title
        </label>
        <input
          id="letter-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          maxLength={120}
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="letter-content" style={{ display: 'block', fontWeight: 600 }}>
          Content
        </label>
        <textarea
          id="letter-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          cols={50}
          placeholder="Write your letter here..."
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <button onClick={handleSave}>Save Letter</button>
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
};