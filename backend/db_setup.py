import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def setup_db():
    try:
        # Connect without DB to create it
        conn = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            port=int(os.getenv("DB_PORT", 3306))
        )
        cursor = conn.cursor()
        
        db_name = os.getenv("DB_NAME", "dremora_db")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        cursor.execute(f"USE {db_name}")
        
        # Contacts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Internships table - Force sync with HTML fields
        cursor.execute("DROP TABLE IF EXISTS internships")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                college VARCHAR(255),
                domain VARCHAR(255),
                why_join TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # AI Chat Logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_chat_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_query TEXT,
                ai_response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print(f"Database '{db_name}' and tables verified successfully.")
        conn.close()
    except Exception as e:
        print(f"Error setting up database: {e}")

if __name__ == "__main__":
    setup_db()
