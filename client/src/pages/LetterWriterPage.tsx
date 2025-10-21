import { useState } from 'react';

export default function LetterWriterPage() {
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:3001/save-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ text }),
            credentials: 'same-origin', // can set to 'include' if needed
        });
            if (!response.ok) {
                throw new Error('saving letter failed, status: ' + response.status);
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
            <textarea
                value={text}
                onChange={handleInputChange}
                rows={10}
                cols={50}
                placeholder="Write your letter here..."
            />
            <div>
                <button onClick={handleSave}>Save Letter to Public Folder</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}