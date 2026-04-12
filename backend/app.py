import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Basic Configuration
app.config['SECRET_KEY'] = 'dremora-super-secret-key-2026'

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
    genai.configure(api_key=GEMINI_API_KEY)
    # Using the standard model for general text tasks
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

# Helper to get DB connection
def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "dremora_db"),
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Dremora Backend API"}), 200

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    data = request.json
    user_msg = data.get('message', '')
    
    if not model:
        return jsonify({
            "response": "Error: Gemini API Key is missing. Please configure backend/.env file with a valid key."
        })
        
    try:
        # Provide system instructions to the model if possible, or just build standard prompt
        prompt = f"""
You are the official AI Assistant for Dremora IT Consultants & Services. You must act as a smart, professional, highly knowledgeable representative.
Dremora builds robust problem-solving software, scalable digital ecosystems, intelligent platforms, and custom business automation tools (like our Demo project 'NagarSeva').
If anyone asks for contact details, provide them accurately: Phone: +91 9309795878, Email: dremora.itservices@gmail.com, Address: Pune, MAHARASHTRA 411032.
Answer the following user query intelligently, concisely, and stay perfectly in character.
If they ask something out of the box, answer smartly and creatively, connecting it back to technology or our capabilities if possible.

User Query: {user_msg}
"""
        response = model.generate_content(prompt)
        # Log to DB (optional, wrapping in try/except)
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO ai_chat_logs (user_query, ai_response) VALUES (%s, %s)",
                    (user_msg, str(response.text))
                )
            conn.commit()
            conn.close()
        except Exception as e:
            print("DB Log Error:", e)

        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"AI Engine encountered an error: {str(e)}"}), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO contacts (name, email, subject, message) VALUES (%s, %s, %s, %s)",
                (data.get('name'), data.get('email'), data.get('subject', 'General Inquiry'), data.get('message'))
            )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Inquiry received successfully!"}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "Failed to submit inquiry."}), 500

@app.route('/api/internship/apply', methods=['POST'])
def submit_internship():
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO internships (name, email, college, domain, why_join) VALUES (%s, %s, %s, %s, %s)",
                (data.get('name'), data.get('email'), data.get('college'), data.get('domain'), data.get('why_join'))
            )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Application submitted successfully!"}), 200
    except Exception as e:
        print(f"Internship Error: {e}")
        return jsonify({"status": "error", "message": "Failed to submit application."}), 500

if __name__ == '__main__':
    # Use environment port for deployment (Render/Railway), default to 5000 for local
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
