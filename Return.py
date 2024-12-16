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
            # Return row ID and Task ID if the identifier exists
            print(f"Duplicate found for identifier: {identifier}")
            return jsonify({
                'isDuplicate': True,
                'message': 'Content already reviewed',
                'row': existing_record[0],  # The first column (index 0) is the row ID
                'Taskid': existing_record[1]  # Assuming the second column (index 1) is the taskid
            })
        else:
            # Insert new record into the data_table
            cursor.execute('INSERT INTO data_table (gti, taskid) VALUES (?, ?)', (identifier, task_id))
            conn.commit()
            print(f"New identifier added: {identifier}")
            
            return jsonify({
                'isDuplicate': False,
                'message': 'Content not reviewed',
                'row': cursor.lastrowid,  # Return the last inserted row ID
                'Taskid': task_id  # Return the task ID from the request
            })

    except Exception as e:
        # Catch any exceptions and return an error message
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500
