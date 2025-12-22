const axios = require("axios"); // ✅ REQUIRED

exports.chat = async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Message history is required' });
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "⚠️ No reply from AI.";

    res.json({ reply });

  } catch (error) {
    console.error(
      'OpenRouter Chat Error:',
      error?.response?.data || error.message
    );
    res.status(500).json({ error: 'OpenRouter chat failed' });
  }
};
