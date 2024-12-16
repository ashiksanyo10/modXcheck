from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize SQLite database
conn = sqlite3.connect('data.db', check_same_thread=False)
cursor = conn.cursor()

# Route to check identifier
@app.route('/check-identifier', methods=['POST'])
def check_identifier():
    data = request.json
    identifier = data.get('identifier')  # gti
    task_id = data.get('task_id')        # task id

    print(f"Received data: Identifier (gti) = {identifier}, Task ID = {task_id}")
    
    # Check if identifier (gti) exists in the database
    cursor.execute('SELECT * FROM data_table WHERE gti = ?', (identifier,))
    existing_record = cursor.fetchone()

    if existing_record:
        print(f"Duplicate found for identifier (gti): {identifier}")
        return jsonify({
            'isDuplicate': True,
            'message': 'Content already reviewed',
            'row': existing_record[0]  # Assuming the row ID is the first column
        })
    else:
        # Insert new record into the database (gti, taskid)
        cursor.execute('INSERT INTO data_table (gti, taskid) VALUES (?, ?)', (identifier, task_id))
        conn.commit()
        print(f"New identifier (gti) added: {identifier}")
        
        return jsonify({
            'isDuplicate': False,
            'message': 'Content not reviewed',
            'row': cursor.lastrowid  # Return the last inserted row ID
        })

if __name__ == '__main__':
    print("Flask server running...")
    app.run(debug=True, host='localhost', port=8080)
