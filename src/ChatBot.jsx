import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [query, setQuery] = useState('');
    const [recipient, setRecipient] = useState('');
    const [status, setStatus] = useState('');

    const handleSendEmail = async () => {
        if (!recipient || !query) {
            setStatus('Please provide both an email address and a query.');
            return;
        }

        try {
            setStatus('Generating email and sending...');
            const response = await axios.post('https://gmailaiagentbe-production.up.railway.app/send-email', {
                recipient,
                query,
            });
            setStatus(response.data.message);

            setTimeout(() => {
                setStatus("")
            }, 3000);
        } catch (error) {
            setStatus('Failed to send email. Please try again.');
            setTimeout(() => {
                setStatus("")
            }, 2000);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Email Agent</h2>
            {status && <p> <b>{status}</b></p>}

            <div style={{marginBottom:'10px'}}>
                <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient email"
                    style={{padding:'10px', borderRadius:'10px', width:'200px'}}
                />
            </div>
            <div style={{marginBottom:'10px'}}>
                <textarea
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Send a mail about the best phones under 20k..."
                    style={{padding:'10px', borderRadius:'10px', width:'200px'}}
                />
            </div>
            <button style={{padding:'5px', width:'200px', borderRadius:'10px'}} onClick={handleSendEmail}>Send Email</button>
        </div>
    );
};

export default ChatBot;
