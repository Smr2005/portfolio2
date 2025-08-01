from flask import Flask, render_template

app = Flask(__name__)

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/3d-showcase')
def showcase():
    return render_template('3d-showcase.html')

# === Start Server ===
if __name__ == "__main__":
    app.run(debug=True)