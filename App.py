from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize SQLite database
conn = sqlite3.connect('identifiers.db', check_same_thread=False)
cursor = conn.cursor()

@app.route('/check-identifier', methods=['POST'])
def check_identifier():
    data = request.json
    identifier = data.get('identifier')
    task_id = data.get('task_id')

    print(f"Received data: Identifier = {identifier}, Task ID = {task_id}")
    
    # Check if identifier exists in the database
    cursor.execute('SELECT * FROM identifiers WHERE identifier = ?', (identifier,))
    existing_record = cursor.fetchone()

    if existing_record:
        print(f"Duplicate found for identifier: {identifier}")
        return jsonify({
            'isDuplicate': True,
            'message': 'Content already reviewed',
            'row': existing_record[0]  # Assuming the row ID is the first column
        })
    else:
        # Insert new record into the database
        cursor.execute('INSERT INTO identifiers (identifier, task_id) VALUES (?, ?)', (identifier, task_id))
        conn.commit()
        print(f"New identifier added: {identifier}")
        
        return jsonify({
            'isDuplicate': False,
            'message': 'Content not reviewed',
            'row': cursor.lastrowid  # Return the last inserted row ID
        })

if __name__ == '__main__':
    print("Flask server running...")
    app.run(debug=True, host='localhost', port=8080)
