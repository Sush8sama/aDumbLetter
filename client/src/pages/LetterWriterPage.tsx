import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LetterWriterPage.css';

export default function LetterWriterPage(user) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);
    const durationMs = 5000; // duration to show message


    useEffect(() => {
    clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => {setMessage(""), setVisible(false)}, durationMs);

    return () => clearTimeout(timerRef.current);
    }, [message]);
    

    const handleSave = async () => {
        try {

            const response = await fetch('http://localhost:3001/letters/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ content, title, user}),
            credentials: 'include', // can set to 'include' if needed
        });
            if (!response.ok) {
                const data = await response.json();
                setMessage(data);
                throw new Error('saving letter failed, status: ' + response.status + response.statusText);
            }

            setMessage('Letter saved successfully!');
            
        } catch (error) {
            setMessage('Error saving the letter.');
            console.error('There was an error saving the letter:', error);
        }
    };

    // Style for the background image div
    const backgroundImageStyle: React.CSSProperties = {
        backgroundImage: 'url(/textures/page.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative', 
        width: '60%',
        height: '80%',
        left: "51%",
        transform: 'translateX(-50%)',
        top: "10%",
        zIndex: 1,
        pointerEvents: 'none', // Ensures the background doesn't interfere with textarea interactions
        userSelect: 'none', // Prevents text selection on the background
    };

    // Updated style for the textarea
    const textareaStyle: React.CSSProperties = {
        fontFamily: 'PixelFont1',
        fontSize: '18px',
        width: '75%',
        left: '48%',
        height: '70%',
        top: '10%',
        transform: 'translateX(-50%)',
        padding:0,
        boxSizing: 'border-box',
        position: 'relative', 
        zIndex: 2,
        backgroundColor: 'transparent',
        color: '#000',
        border: 'none',
        resize: 'vertical',
        pointerEvents: 'auto', // Ensures the textarea is interactive
    };


    return (
        <div id = "letter-writer-page"> 
            <div id = "title-input-wrapper">
                <input
                    className='title-bar'
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title"
                    maxLength={120}
                />
            </div>
            <div style={backgroundImageStyle}>
                <textarea
                    className="letter-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={150}
                    cols={40}
                    placeholder="Write your letter here..."
                    style={textareaStyle}
                />
            </div>
            <div>
                <button 
                className='save-button'
                onClick={handleSave}>Save Letter</button>
            </div>
            <div className='message-overlay'>
                {visible && (
                <div className='message-area'>
                {message}
                </div>
                )}
            </div>
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