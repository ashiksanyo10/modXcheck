from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('review.db')  # Adjust path if needed
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn

@app.route('/check-identifier', methods=['POST'])
def check_identifier():
    data = request.json
    identifier = data.get('identifier')
    task_id = data.get('task_id')

    print(f"Received data: Identifier = {identifier}, Task ID = {task_id}")
    
    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if identifier (gti) exists in the database
    cursor.execute('SELECT rowid, gti, taskid FROM content_table WHERE gti = ?', (identifier,))
    existing_record = cursor.fetchone()

    if existing_record:
        # If a duplicate is found, return the rowid and taskid
        print(f"Duplicate found for identifier: {identifier}")
        return jsonify({
            'isDuplicate': True,
            'message': 'Content already reviewed',
            'row': existing_record['rowid'],  # Returning rowid from the database
            'taskid': existing_record['taskid']  # Returning the corresponding taskid
        })
    else:
        # If no duplicate is found, insert the new record
        cursor.execute('INSERT INTO content_table (gti, taskid) VALUES (?, ?)', (identifier, task_id))
        conn.commit()
        print(f"New identifier added: {identifier}")
        
        # Return response for the newly inserted content
        return jsonify({
            'isDuplicate': False,
            'message': 'Content not reviewed',
            'row': cursor.lastrowid,  # Return the last inserted rowid
            'taskid': task_id  # Returning the taskid
        })

if __name__ == '__main__':
    print("Flask server running...")
    app.run(debug=True, host='localhost', port=8080)
