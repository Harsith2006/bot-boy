from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

# Load API key securely from Render environment
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    print("\nUser:", user_message)

    if not user_message:
        return jsonify({"reply": "⚠️ Please type something."})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are BOT-BOY, a friendly AI assistant."},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content
        print("BOT-BOY:", reply)
        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "⚠️ BOT-BOY server error"})


if __name__ == "__main__":
    print("🤖 BOT-BOY running...")
    app.run(host="0.0.0.0", port=10000)