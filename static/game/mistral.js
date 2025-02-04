class MistralAPI {
  constructor() {
   
  }

  async sendMessage(messages) {
    const response = await fetch("/mistral-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: messages,
        temperature: 0.5,
        top_p: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
