---
title: Text to Survive
emoji: 📱
colorFrom: gray
colorTo: red
sdk: gradio
sdk_version: "3.50.2"
app_file: app.py
pinned: false
---

# Text to Survive - A Text-Based Horror Escape Game

An 2D game built with p5.js and Mistral AI API. The game revolves around a girlfriend who is trapped in an appartment with a murderous clown that is chasing her. The player must help her navigate the appartment and find the key to escape by texting her instructions.

This game was built for the Mistral AI Gamejam Hackathon 2025 in Paris.

It combines basic 2D game mechanics with a large language model to create a unique and engaging experience.

## Technical Stack

### Backend
- **Flask**: Python web framework serving as proxy to mistral api
- **Mistral AI API**: Large Language Model powering the texting interface and girlfriend decision making

### Frontend
- **Vanilla JavaScript**: Core game logic and user interactions
- **P5.js**: Creative coding library used for visual effects and animations

### Docker

# Build the image

docker build -t p5js-game .

# Run the container

docker run -p 8000:8000 p5js-game

### API Key Setup

To run this game, you'll need a Mistral AI API key. You can obtain one by:

1. Going to [Mistral AI Platform](https://console.mistral.ai/)
2. Creating an account
3. Generating an API key in your dashboard

Once you have your API key, you can set it as an environment variable:


## Authors

| Name | Links |
|------|-------|
| Johnny Moacdieh | [LinkedIn](https://www.linkedin.com/in/johnny-moacdieh-935687b3/) • [Website](http://johnnym.dev/) |
| Carl Farra | [LinkedIn](https://www.linkedin.com/in/carlfarra/) • [Website](https://rpsdaily.com/) |
| Remi Kaito | [LinkedIn](https://www.linkedin.com/in/remikaito/) • [X/Twitter](https://x.com/mrrremi) |
| Cosimo Taiuti | [LinkedIn](https://www.linkedin.com/in/cosimotaiuti/) |
| Joseph "Tonic" Pollack | [LinkedIn](https://www.linkedin.com/in/josephpollack/) • [HuggingFace](https://huggingface.co/Tonic) |
| Luca Teodorescu | [LinkedIn](https://www.linkedin.com/in/luca-teodorescu/) |



