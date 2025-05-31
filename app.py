from flask import Flask, render_template, request, redirect, url_for, session, flash
import MySQLdb.cursors
from flask_mysqldb import MySQL  
import matplotlib.pyplot as plt
import pandas as pd
import os   
import io
import base64
 
# App setup
app = Flask(__name__)
app.config.from_pyfile('config.py')
mysql = MySQL(app)

# Home/Login
@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    # adding data into database
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM login WHERE username=%s", (username,))
        user = cursor.fetchone()

        if user and user['password'] == password:
            session['loggedin'] = True
            session['id'] = user['id']
            session['username'] = user['username']
            return redirect('/index')
        else:
            error = "Invalid credentials"

    return render_template('login.html', error=error)

 
# Signup
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        age = request.form['age']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM login WHERE username = %s", (username,))
        account = cursor.fetchone()

        if account:
            flash("Username already exists", "warning") 
            return redirect(url_for('signup')) 
        else:
            cursor.execute("INSERT INTO login (username, password, age) VALUES (%s, %s, %s)",
                           (username, password, age))
            mysql.connection.commit()
            flash("Account created! You can log in now.", "success")

            return redirect('/login')   
    return render_template('signup.html',error = error)


# Dashboard
@app.route('/index')
def index():
    if 'loggedin' in session:
        return render_template('index.html',username=session['username'])
    else:
        # Redirect to login if not logged in
        return redirect('/login')

    
# profile
@app.route('/profile')
def profile():
    if 'loggedin' in session:
        return render_template('profile.html', username=session['username'])
    
# Learn
@app.route('/learn')
def learn():
    if 'loggedin' in session:
        return render_template('learn.html', username=session['username'])
   
#Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/expense', methods=['GET', 'POST'])
def expense():
    if request.method == 'POST':
        user_id = session.get('id')
        amount = request.form['amount']
        category = request.form['category']
        date = request.form['date']
        description = request.form['description']

        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO expenses (amount, category, date_created, user_id, description) VALUES (%s, %s, %s, %s, %s)",
            (amount, category, date, user_id, description)
        )
        mysql.connection.commit()
        flash("Expense added successfully!", "success")
        return redirect(url_for('expense'))  # Redirect after POST

    # For GET request, fetch expenses and chart data
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM expenses WHERE user_id = %s", (session.get('id'),))
    expenses = cursor.fetchall()

    # Fetch category-wise total for pie chart
    cursor.execute("""
        SELECT category, SUM(amount) AS total
        FROM expenses
        WHERE user_id = %s
        GROUP BY category
    """, (session.get('id'),))
    data = cursor.fetchall()

    df = pd.DataFrame(data)
    plt.pie(df['total'], labels=df['category'], autopct='%1.1f%%', startangle=140)
    plt.savefig('static/pie_chart.png', format='png')
    plt.close()
    print(df)
    return render_template('expense.html', expenses=expenses)

@app.route('/goal', methods=['GET', 'POST'])
def goal():
    if request.method == 'POST':
        user_id = session.get('id')
        goal_name = request.form['goal_name']
        target_amount = request.form['target_amount']
        current_amount = request.form['current_amount']
        deadline = request.form['deadline']

        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO goals (user_id, goal_name, target_amount, current_amount, deadline) VALUES (%s, %s, %s, %s, %s)",
            (user_id, goal_name, target_amount, current_amount, deadline)
        )
        mysql.connection.commit()
        flash("Goal added successfully!", "success")
        return redirect(url_for('goal'))  # Redirect after POST

    # For GET request, fetch goals
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM goals WHERE user_id = %s", (session.get('id'),))
    goals = cursor.fetchall()

    return render_template('goal.html', goals=goals)

@app.route('/pcontrol')
def pcontrol():
    return render_template('pcontrol.html')

if __name__ == '__main__':
    app.run(debug=True)
