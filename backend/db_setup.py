import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def setup_db():
    try:
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            conn = psycopg2.connect(db_url)
        else:
            conn = psycopg2.connect(
                host=os.getenv("DB_HOST", "localhost"),
                user=os.getenv("DB_USER", "postgres"),
                password=os.getenv("DB_PASSWORD", ""),
                dbname=os.getenv("DB_NAME", "postgres"),
                port=int(os.getenv("DB_PORT", 5432))
            )
        cursor = conn.cursor()
        
        # Contacts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Internships table - Force sync with HTML fields
        cursor.execute("DROP TABLE IF EXISTS internships")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internships (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                college VARCHAR(255),
                domain VARCHAR(255),
                why_join TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # AI Chat Logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_chat_logs (
                id SERIAL PRIMARY KEY,
                user_query TEXT,
                ai_response TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print("PostgreSQL tables created successfully.")
        conn.close()
    except Exception as e:
        print(f"Error setting up database: {e}")

if __name__ == "__main__":
    setup_db()
