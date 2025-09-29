document.addEventListener("DOMContentLoaded",()=>{
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");

    userInput.addEventListener('input',()=>{
        userInput.style.height = 'auto'
        userInput.style.height = userInput.scrollHeight + "px";
    })
    chatForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const  message = userInput.value.trim();
        if(!message) return;
        addMessage(message, true);
        //generateResponse(message);
        userInput.value = "";
        userInput.style.height = 'auto';
        sendButton.disabled = true;

        const typingIndicator = showTypingIndicator();
        try {
            //response generation
           const response = await generateResponse(message);
           typingIndicator.remove();

           addMessage(response, false);
           console.log(response);
           
        } catch (error) {
            typingIndicator.remove();
            addErrorMessage(error.message);
            
        }finally{
            sendButton.disabled = false;
        }
    })

    async function generateResponse(prompt) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          method: "post",
          headers: {
            "x-goog-api-key": "API Key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate the response");
      }
      const data = await response.json();
      //console.log(data.candidates[0].content.parts[0].text);
      return data.candidates[0].content.parts[0].text;
    }

    //Append user messages
    function addMessage(text, isUser) {
      const message = document.createElement("div");
      message.className = `message ${isUser ? "user-message" : ""}`;
      message.innerHTML = `
    <div class="avatar ${isUser ? "user-avatar" : ""}">
    ${isUser ? "U" : "Ai"}
    </div>
    <div class = 'message-content'>${text}</div>
    `;
      chatMessages.appendChild(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator(){
        const indicator = document.createElement("div");
        indicator.className = 'message';
        indicator.innerHTML = `
        <div class = 'avatar'>AI</div>
        <div class = 'typing-indicator'>
        <div class = 'dot'></div>
        <div class = 'dot'></div>
        <div class = 'dot'></div>
        </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    //Error
    function addErrorMessage(text){
        const message = document.createElement('div');
        message.className = 'message';
        message.innerHTML = `
        <div class = 'avatar'>AI</div>
        <div class = 'message-content' style = 'color:red'>
        Error:${text}
        </div>
        `;

    }
})

