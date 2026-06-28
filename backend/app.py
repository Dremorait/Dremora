import os
import re
from functools import wraps
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from email_validator import validate_email, EmailNotValidError

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Basic Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dremora-super-secret-key-2026')

# ---- CORS Hardening ----
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",")]
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

# ---- Rate Limiting ----
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://" # Use Redis for distributed production
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
    genai.configure(api_key=GEMINI_API_KEY)
    # Using the standard model for general text tasks
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

# Supabase client — created once at startup (singleton)
_supabase_client: Client = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials in .env")
        _supabase_client = create_client(url, key)
    return _supabase_client

# ---- Security Helpers ----
def sanitize_input(value, max_length=2000):
    """Strips HTML tags and restricts length."""
    if not isinstance(value, str):
        return None
    # Strip basic HTML tags
    clean_val = re.sub(r'<[^>]*>', '', value)
    return clean_val.strip()[:max_length]

def is_valid_email(email_str):
    try:
        validate_email(email_str, check_deliverability=False)
        return True
    except EmailNotValidError:
        return False

# ---- RBAC Middleware ----
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        admin_token = os.environ.get("ADMIN_SECRET_TOKEN")
        
        if not admin_token:
            # If backend not configured properly, deny access securely
            app.logger.error("ADMIN_SECRET_TOKEN not configured.")
            return jsonify({"error": "Unauthorized"}), 401
            
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
            
        token = auth_header.split(" ")[1]
        if token != admin_token:
            return jsonify({"error": "Unauthorized"}), 401
            
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/health', methods=['GET'])
@limiter.exempt
def health_check():
    return jsonify({"status": "healthy", "service": "Dremora Backend API (Secured)"}), 200

@app.route('/api/admin/health', methods=['GET'])
@admin_required
def admin_health_check():
    return jsonify({"status": "admin_healthy", "message": "Admin clearance verified."}), 200

@app.route('/api/ai/chat', methods=['POST'])
@limiter.limit("20 per minute")
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
Dremora builds robust problem-solving software, scalable digital ecosystems, intelligent platforms, and custom business automation tools (like our Demo project 'Prototype Cafe').
If anyone asks for contact details, provide them accurately: Phone: +91 9309795878, Email: dremora.itservices@gmail.com, Address: Pune, MAHARASHTRA 411032.
Answer the following user query intelligently, concisely, and stay perfectly in character.
If they ask something out of the box, answer smartly and creatively, connecting it back to technology or our capabilities if possible.

User Query: {user_msg}
"""
        response = model.generate_content(prompt)
        # Log to DB (optional, wrapping in try/except)
        try:
            supabase = get_supabase_client()
            supabase.table("ai_chat_logs").insert({
                "user_query": user_msg,
                "ai_response": str(response.text)
            }).execute()
        except Exception as e:
            print("DB Log Error:", e)

        return jsonify({"response": response.text})
    except Exception as e:
        app.logger.error(f"AI Chat Error: {str(e)}")
        return jsonify({"response": "AI Engine is temporarily unavailable."}), 500

@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per minute")
def submit_contact():
    data = request.json
    try:
        # Strict Input Validation
        name = sanitize_input(data.get('name'), 100)
        email = sanitize_input(data.get('email'), 100)
        subject = sanitize_input(data.get('subject', 'General Inquiry'), 200)
        message = sanitize_input(data.get('message'), 2000)

        if not name or not message:
            return jsonify({"status": "error", "message": "Name and message are required."}), 400
            
        if email and not is_valid_email(email):
            return jsonify({"status": "error", "message": "Invalid email address."}), 400

        supabase = get_supabase_client()
        supabase.table("contacts").insert({
            "name": name,
            "email": email,
            "subject": subject,
            "message": message
        }).execute()
        return jsonify({"status": "success", "message": "Inquiry received successfully!"}), 200
    except Exception as e:
        app.logger.error(f"Contact Error: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to submit inquiry due to an internal error."}), 500

@app.route('/api/internship/apply', methods=['POST'])
@limiter.limit("5 per minute")
def submit_internship():
    data = request.json
    try:
        name = sanitize_input(data.get('name'), 100)
        email = sanitize_input(data.get('email'), 100)
        college = sanitize_input(data.get('college'), 255)
        domain = sanitize_input(data.get('domain'), 255)
        why_join = sanitize_input(data.get('why_join'), 3000)

        if not name or not email:
            return jsonify({"status": "error", "message": "Name and email are required."}), 400
            
        if not is_valid_email(email):
            return jsonify({"status": "error", "message": "Invalid email address."}), 400

        supabase = get_supabase_client()
        supabase.table("internships").insert({
            "name": name,
            "email": email,
            "college": college,
            "domain": domain,
            "why_join": why_join
        }).execute()
        return jsonify({"status": "success", "message": "Application submitted successfully!"}), 200
    except Exception as e:
        app.logger.error(f"Internship Error: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to submit application due to an internal error."}), 500

if __name__ == '__main__':
    # Use environment port for deployment (Render/Railway), default to 5000 for local
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
