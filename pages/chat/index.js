import Head from 'next/head';
import { useState } from 'react';
import styles from '../index.module.css';

export default function Chat() {
    const [animalInput, setAnimalInput] = useState('');
    const [chatComponents, setChatComponents] = useState([
        {
            role: 'system',
            content: 'Hi there! I am a cool assistant full of creativity and humor\nHow can I help you today?'
        }
    ]);

    async function onSubmit(event) {
        event.preventDefault();

        // classic mistake: setChatComponents([...chatComponents, { role: 'user', content: animalInput }]);
        setChatComponents(chatComponents => [...chatComponents, { role: 'user', content: animalInput }]);
        setAnimalInput('');
        try {
            const response = await fetch('/api/chatComplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: animalInput })
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setChatComponents(chatComponents => [...chatComponents, { role: 'system', content: data.result }]);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <Head>
                <title>Chat with DogAI</title>
                <link rel="icon" href="/dog.png" />
            </Head>

            <main className={styles.main}>
                <img src="/dog.png" className={styles.icon} />
                <h3>Chat with DogAI</h3>
                {chatComponents.map(({ content, role }, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                whiteSpace: 'pre-line',
                                border: '1px solid black',
                                margin: '15px 0',
                                padding: '15px',
                                borderRadius: '7px'
                            }}>
                            {content}
                        </div>
                    );
                })}
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="animal"
                        placeholder="Enter an animal"
                        value={animalInput}
                        onChange={e => setAnimalInput(e.target.value)}
                    />
                    <input type="submit" value="Submit" />
                </form>
            </main>
        </div>
    );
}
