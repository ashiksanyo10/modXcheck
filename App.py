from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# SQLite database setup
conn = sqlite3.connect('identifiers.db', check_same_thread=False)
cursor = conn.cursor()

# Check if the identifier is already in the database
@app.route('/check', methods=['POST'])
def check_identifier():
    data = request.get_json()
    gti = data.get('gti')
    task_id = data.get('taskId')

    # Check for duplicate identifier
    cursor.execute('SELECT * FROM identifiers WHERE identifier = ?', (gti,))
    existing = cursor.fetchone()
    
    if existing:
        return jsonify({"isDuplicate": True, "message": "Duplicate identifier."})
    else:
        # If not a duplicate, add the new identifier and task_id to the database
        date = datetime.now().strftime('%Y-%m-%d')
        cursor.execute('INSERT INTO identifiers (date, identifier) VALUES (?, ?)', (date, gti))
        conn.commit()
        return jsonify({"isDuplicate": False, "message": "Identifier added successfully."})

if __name__ == '__main__':
    app.run(debug=True)
