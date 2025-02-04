function createLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-message assistant-message";
  loadingDiv.innerHTML = `
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            `;
  return loadingDiv;
}

async function addProgramaticMessage(message) {
  const chatHistory = document.getElementById("chatHistory");
  const loadingIndicator = createLoadingIndicator();
  chatHistory.appendChild(loadingIndicator);
  await new Promise(resolve => setTimeout(resolve, 2000));
  chatHistory.removeChild(loadingIndicator);
  addMessageToChat("assistant", message);
}

async function strongIndependantWoman(){
  
    const chatHistory = document.getElementById("chatHistory");
    const loadingIndicator = createLoadingIndicator();
    chatHistory.appendChild(loadingIndicator);
    chatHistory.scrollTop = chatHistory.scrollHeight;

  
    let masterPrompt = gameState.getPrompt();

    const recentMessages = chatMessages.slice(-5);
  
    const messages = [
      { role: "system", content: masterPrompt },
      ...recentMessages,
      { role: "user", content: `
        **your boyfriend has been away from his phone for a while and has not replied promptly to your last message, 
        you shall based on all that you know decide to take an action, also you're pissed at the boyfriend**
        you are brave, strong, fabulous and will do something about this situation
        you're gall is to escape the house and avoid the clown at all costs
        
        ` },
    ];
  
    const assistantResponse = await mistralAPI.sendMessage(messages);
  
    chatHistory.removeChild(loadingIndicator);
  
    const jsonStart = assistantResponse.indexOf("{");
    const jsonEnd = assistantResponse.lastIndexOf("}") + 1;
    const jsonContent = assistantResponse.substring(jsonStart, jsonEnd);
    const jsonResponse = JSON.parse(jsonContent);
  
    if (jsonResponse.action) {
      girlfriend.handleAction(jsonResponse, true);
    }
  
    if (jsonResponse.textMessage) {
      addMessageToChat("assistant", jsonResponse.textMessage);
    }
}

async function sendMessage() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return;

  addMessageToChat("user", prompt);
  document.getElementById("prompt").value = "";

  const chatHistory = document.getElementById("chatHistory");
  const loadingIndicator = createLoadingIndicator();
  chatHistory.appendChild(loadingIndicator);
  chatHistory.scrollTop = chatHistory.scrollHeight;


  // First, get the stress prompt and send it
  const stressPrompt = gameState.getStressPrompt();
  const stressMessages = [
    {
      role: "system",
      content: stressPrompt,
    },
    { role: "user", content: prompt },
  ];

  const stressResponse = await mistralAPI.sendMessage(stressMessages);
  const stressChange = JSON.parse(stressResponse).stressChange || 0;

  girlfriend.updateStressLevel(stressChange);
 

  let masterPrompt = gameState.getPrompt();
  const recentMessages = chatMessages.slice(-5);

  const messages = [
    { role: "system", content: masterPrompt },
    ...recentMessages,
    { role: "user", content: prompt },
  ];

  const assistantResponse = await mistralAPI.sendMessage(messages);

  chatHistory.removeChild(loadingIndicator);

  const jsonStart = assistantResponse.indexOf("{");
  const jsonEnd = assistantResponse.lastIndexOf("}") + 1;
  const jsonContent = assistantResponse.substring(jsonStart, jsonEnd);
  const jsonResponse = JSON.parse(jsonContent);

  if (jsonResponse.action) {
    girlfriend.handleAction(jsonResponse, true);
  }

  if (jsonResponse.textMessage) {
    addMessageToChat("assistant", jsonResponse.textMessage);
  }
}

function addMessageToChat(role, content) {
  const chatHistory = document.getElementById("chatHistory");
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${role}-message`;
  messageDiv.textContent = content;
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  chatMessages.push({ role, content });

  if (role === "assistant" && localStorage.getItem("isSoundOn") !== "false") {
    playSound('message');
  }
}


// Allow sending message with Enter
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prompt").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  try {
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.currentTime = 10;
    bgMusic.play().catch((error) => {
      isSoundOn = false;
      updateSoundIcon();
    });
  } catch (error) {
  }
});
