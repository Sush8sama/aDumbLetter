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

    const contentWrapperStyle: React.CSSProperties = {
        userSelect: 'none',
        position: 'relative', 
        top:"20%",
        marginBottom: 0,
        pointerEvents: 'all',
    };

    // Style for the background image div
    const backgroundImageStyle: React.CSSProperties = {
        backgroundImage: 'url(/textures/page.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative', 
        width: '60%',
        height: '80%',
        left: "50%",
        transform: 'translateX(-50%)',
        top: "10%",
        zIndex: 1,
    };

    // Updated style for the textarea
    const textareaStyle: React.CSSProperties = {
        width: '75%',
        left: '50%',
        height: '10%',
        top: '10%',
        transform: 'translateX(-50%)',
        padding:0,
        boxSizing: 'border-box',
        position: 'relative', 
        zIndex: 2,
        backgroundColor: 'transparent',
        color: '#000',
        border: '0px',
        resize: 'vertical',
    };


    return (
        <div id = "letter-writer-page"> 
            <div style={{ marginBottom: 8 }}>

                <input
                    id="letter-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title"
                    maxLength={120}
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box', zIndex: 10, position: 'relative' }}
                />
            </div>
            <div style = {contentWrapperStyle}>
                <label htmlFor="letter-content" style={{ display: 'block', fontWeight: 600 }}>
                    Content
                </label>
                <div style={backgroundImageStyle}>
                    <textarea
                        id="letter-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={55}
                        cols={40}
                        placeholder="Write your letter here..."
                        style={textareaStyle}
                    />
                </div>
            </div>

            <div>
                <button 
                className='save-button'
                onClick={handleSave}>Save Letter</button>
            </div>
            {message && <p style={{ marginTop: 12 }}>{message}</p>}
            <div>
                <img 
                    src={'/textures/typewriter.png'} 
                    alt="A descriptive alt text" 
                    className='typewriter' 
                />
            </div>
        </div>
    );
};