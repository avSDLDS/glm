from flask import Flask, request, jsonify, render_template
from zhipuai import ZhipuAI

app = Flask(__name__)

# 用于存储对话历史的全局变量
conversation = []

# 内置的API key
api_key = "1725cfb09bccfb06ecc170c6168629d4.zRHOOCSvcDprFFKD"  # 将这里的字符串替换为你的API key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    global conversation
    data = request.json
    user_message = data["message"]
    model = data.get("model")  # 必填项
    temperature = data.get("temperature")  # 选填项
    top_p = data.get("top_p")  # 选填项
    max_tokens = data.get("max_tokens")  # 选填项
    system_message = data.get("system_message")  # 用户自定义系统消息

    client = ZhipuAI(api_key=api_key)

    # 如果conversation为空，初始化系统消息
    if not conversation:
        system_message = system_message if system_message else "你是一个人工智能助手，你叫chatGLM。"
        conversation.append({"role": "system", "content": system_message})

    conversation.append({"role": "user", "content": user_message})

    # 构建请求参数
    request_params = {
        "model": model,
        "messages": conversation,
        "stream": False
    }
    if temperature is not None:
        request_params["temperature"] = temperature
    if top_p is not None:
        request_params["top_p"] = top_p
    if max_tokens is not None:
        request_params["max_tokens"] = max_tokens

    response = client.chat.completions.create(**request_params)
    
    ai_response = response.choices[0].message.content if hasattr(response.choices[0].message, 'content') else ''
    tokens_used = response.usage.total_tokens if hasattr(response.usage, 'total_tokens') else 0

    conversation.append({"role": "assistant", "content": ai_response})

    return jsonify(ai_response=ai_response, tokens_used=tokens_used)

@app.route('/reset_conversation', methods=['POST'])
def reset_conversation():
    global conversation
    conversation = []  # 清空对话历史
    return jsonify(status="success")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # 在生产环境中，请设置 debug=False
