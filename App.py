from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize SQLite database
conn = sqlite3.connect('data.db', check_same_thread=False)
cursor = conn.cursor()

@app.route('/check-identifier', methods=['POST'])
def check_identifier():
    try:
        # Get the data from the POST request
        data = request.json
        identifier = data.get('identifier')
        task_id = data.get('task_id')

        if not identifier or not task_id:
            return jsonify({'error': 'Both identifier and task_id are required'}), 400

        print(f"Received data: Identifier = {identifier}, Task ID = {task_id}")
        
        # Query the database to see if the identifier exists in the data_table
        cursor.execute('SELECT * FROM data_table WHERE gti = ?', (identifier,))
        existing_record = cursor.fetchone()

        if existing_record:
            print(f"Duplicate found for identifier: {identifier}")
            return jsonify({
                'isDuplicate': True,
                'message': 'Content already reviewed',
                'row': existing_record[0]  # Assuming the row ID is the first column
            })
        else:
            # Insert new record into the data_table
            cursor.execute('INSERT INTO data_table (gti, taskid) VALUES (?, ?)', (identifier, task_id))
            conn.commit()
            print(f"New identifier added: {identifier}")
            
            return jsonify({
                'isDuplicate': False,
                'message': 'Content not reviewed',
                'row': cursor.lastrowid  # Return the last inserted row ID
            })

    except Exception as e:
        # Catch any exceptions and return an error message
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("Flask server running...")
    app.run(debug=True, host='localhost', port=8080)
