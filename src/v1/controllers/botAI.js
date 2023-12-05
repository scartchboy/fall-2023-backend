const OpenAI = require('openai')
require('dotenv').config()

const openai = new OpenAI({
    apiKey: "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",
  });

let messages = []; 

const chat = async (req, res) => {
  const { message, title } = req.body;

  const { loadText, clearMessages } = req.query;

  if(clearMessages) messages = [];

  if(loadText) {
    messages.push(
      {
        role: "assistant",
        content:
          "Hello, I'm your assistant. How can I help you today?",
      },
      {
        role: "user",
        content: `Read the abstract of this thesis titled: ${title} \n : ${message}. Answer the following questions from the user.`
      },
    );
  } else {
    messages.push(
      {
        role: "user",
        content: message
      },
    );
  }

	try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages ,
    })
    res.send(response.choices);
	} catch(error) {
		console.log(error);
		return res.send(error.message);
	}
}

module.exports = { chat }