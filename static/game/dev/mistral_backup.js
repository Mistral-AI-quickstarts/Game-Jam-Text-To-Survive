class MistralAPI {
    constructor() {
        this.apiKey = localStorage.getItem('mistralApiKey');
        this.temperature = 0.7; // Default temperature
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('mistralApiKey', key);
    }

    getApiKey() {
        return this.apiKey;
    }

    setTemperature(temp) {
        // Ensure temperature is between 0 and 1
        this.temperature = Math.max(0, Math.min(1, temp));
    }

    getTemperature() {
        return this.temperature;
    }

    async sendMessage(messages) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: messages,
                temperature: this.temperature  // Add temperature to the request
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}