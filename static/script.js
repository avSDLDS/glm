let apiKey = localStorage.getItem('apiKey') || '';
        let model = 'glm-4'; // 默认模型
        let temperature, top_p, max_tokens;

        function sendMessage() {
    const inputField = document.getElementById("messageInput");
    const message = inputField.value.trim();
    if (message === '') return;
    inputField.value = "";

    const messagesContainer = document.getElementById("messages");
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.textContent = message;
    messagesContainer.appendChild(userMessageDiv);

    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, apiKey: apiKey }),
    })
    .then(response => response.json())
    .then(data => {
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.classList.add('message', 'ai-message');
        aiMessageDiv.textContent = data.ai_response ? data.ai_response : "AI did not respond";
        messagesContainer.appendChild(aiMessageDiv);

        // 显示token数值
        if (data.tokens_used) {
            const tokenInfoDiv = document.createElement('div');
            tokenInfoDiv.classList.add('token-info');
            tokenInfoDiv.textContent = `Tokens used: ${data.tokens_used}`;
            messagesContainer.appendChild(tokenInfoDiv);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

function showApiKeyModal() {
    document.getElementById("apiKeyModal").style.display = "block";
}

function resetConversation() {
    fetch('/reset_conversation', {
        method: 'POST',
    })
    .then(response => {
        // 清空对话历史
        document.getElementById("messages").innerHTML = "";
    });
}

function submitApiKey() {
    const apiKeyField = document.getElementById("apiKeyInput");
    const apiKey = apiKeyField.value.trim();
    if (apiKey === '') {
        alert('Please enter API Key');
        return;
    }
    localStorage.setItem("apiKey", apiKey);
    document.getElementById("apiKeyModal").style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById("messageInput");
    inputField.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "Enter") {
            sendMessage();
        }
    });
});


        // 显示设置页面
        function showSettingsModal() {
            document.getElementById("settingsModal").style.display = "flex";
        }

        function closeSettings() {
            document.getElementById("settingsModal").style.display = "none";
        }
        

        // 提交设置
        function submitSettings() {
    model = document.getElementById("modelInput").value;
    temperature = document.getElementById("temperatureInput").value;
    top_p = document.getElementById("topPInput").value;
    max_tokens = document.getElementById("maxTokensInput").value;
    system_message = document.getElementById("systemMessageInput").value; // 获取系统消息输入
    document.getElementById("settingsModal").style.display = "none";
    resetConversation();
}


        // 修改sendMessage函数以包含新参数
        function sendMessage() {
            const inputField = document.getElementById("messageInput");
            const message = inputField.value.trim();
            if (message === '') return;
            inputField.value = "";
        
            const messagesContainer = document.getElementById("messages");
        
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.textContent = message;
        
            const userAvatar = document.createElement('img');
            userAvatar.src = 'https://www.freeimg.cn/i/2024/01/01/65926b79d936e.jpg';
            userAvatar.classList.add('user-avatar');
        
            userMessageDiv.appendChild(userAvatar);
            messagesContainer.appendChild(userMessageDiv);
        
            // 创建请求体
            const requestBody = {
                message: message,
                apiKey: apiKey,
                model: model,
                system_message: system_message
            };
            if (temperature) requestBody.temperature = parseFloat(temperature);
            if (top_p) requestBody.top_p = parseFloat(top_p);
            if (max_tokens) requestBody.max_tokens = parseInt(max_tokens);
        
            fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
            .then(response => response.json())
            .then(data => {
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.classList.add('message', 'ai-message');
                aiMessageDiv.textContent = data.ai_response ? data.ai_response : "AI did not respond";
        
                const aiAvatar = document.createElement('img');
                aiAvatar.src = 'https://www.freeimg.cn/i/2024/01/18/65a83816a2c77.png';
                aiAvatar.classList.add('ai-avatar');
        
                aiMessageDiv.appendChild(aiAvatar);
                messagesContainer.appendChild(aiMessageDiv);
        
                // 显示token数值
                if (data.tokens_used) {
                    const tokenInfoDiv = document.createElement('div');
                    tokenInfoDiv.classList.add('token-info');
                    tokenInfoDiv.textContent = `Tokens used: ${data.tokens_used}`;
                    messagesContainer.appendChild(tokenInfoDiv);
                }
        
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }
        

        document.addEventListener('DOMContentLoaded', () => {
    checkApiKey();
    const inputField = document.getElementById("messageInput");
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // 如果有其他在DOMContentLoaded事件中需要执行的代码，也应该包含在这里
    // 例如绑定其他按钮的事件处理器，初始化页面状态等
});
