import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY;

export default async function (req, res) {
    if (!apiKey) {
        res.status(500).json({
            error: {
                message: 'OpenAI API key not configured, please follow instructions in README.md'
            }
        });
        return;
    }

    try {
        const messages = generateMessages({ role: 'user', content: req.body.content });
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo-0301',
                messages
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` }
            }
        );

        console.log(messages);

        const result = response.data?.choices?.[0]?.message?.content;
        generateMessages({ role: 'system', content: result });

        res.status(200).json({ result });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.'
                }
            });
        }
    }
}

const generateMessages = (() => {
    const messages = [
        {
            role: 'system',
            content: 'You are an AI assistant full of creativity and humor'
        }
    ];
    return ({ content = '', role = 'user' }) => {
        messages.push({ role, content });
        return messages;
    };
})();
