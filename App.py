from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for testing

# Initialize SQLite database
conn = sqlite3.connect('identifiers.db', check_same_thread=False)
cursor = conn.cursor()

# Create the table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS identifiers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT,
                    identifier TEXT UNIQUE)''')
conn.commit()

# Route to check the identifier
@app.route('/check-identifier', methods=['POST'])
def check_identifier():
    data = request.get_json()
    identifier = data.get('identifier')
    task_id = data.get('task_id')
    
    # Check if identifier exists in the database
    cursor.execute('SELECT * FROM identifiers WHERE identifier = ?', (identifier,))
    existing_identifier = cursor.fetchone()
    
    if existing_identifier:
        row_number = existing_identifier[0]  # The row is identified by the primary key (ID)
        return jsonify({"isDuplicate": True, "message": "Content already reviewed", "row": f"found at {row_number}"})
    
    # Add the new identifier to the database
    date = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('INSERT INTO identifiers (date, identifier) VALUES (?, ?)', (date, identifier))
    conn.commit()
    
    # Get the last inserted row id
    row_number = cursor.lastrowid
    return jsonify({"isDuplicate": False, "message": "Content not reviewed", "row": f"added to {row_number}"})

# Test route to verify if the server is running
@app.route('/')
def home():
    return "Flask server is running!"

if __name__ == '__main__':
    app.run(port=8080, debug=True)
