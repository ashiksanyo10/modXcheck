from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# SQLite database connection function
def get_db_connection():
    conn = sqlite3.connect('identifiers.db')
    conn.row_factory = sqlite3.Row
    return conn

# Check if the identifier (gti) already exists in the database
@app.route('/check_identifier', methods=['GET'])
def check_identifier():
    gti = request.args.get('gti')  # Get gti from query param
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM identifiers WHERE identifier = ?', (gti,))
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return jsonify({"isDuplicate": True, "message": "Duplicate identifier."})
    else:
        return jsonify({"isDuplicate": False, "message": "Unique identifier."})

# Add a new identifier (gti and taskid) to the database
@app.route('/add_identifier', methods=['POST'])
def add_identifier():
    gti = request.json.get('gti')  # Get gti from JSON body
    taskid = request.json.get('taskid')  # Get taskid from JSON body
    date = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('INSERT INTO identifiers (date, identifier, taskid) VALUES (?, ?, ?)', (date, gti, taskid))
        conn.commit()
        conn.close()
        return jsonify({"isDuplicate": False, "message": "Identifier added successfully."})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"isDuplicate": True, "message": "Duplicate identifier."})

if __name__ == '__main__':
    app.run(debug=True)
