import { useState } from 'react';
import axios from 'axios';

export default function LetterWriterPage() {
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:3001/save-letter', { text });
            setMessage(response.data);
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