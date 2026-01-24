from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

# ---------------- CONFIG ----------------
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

RAW_FILE = os.path.join(UPLOAD_FOLDER, "raw.csv")
CLEAN_FILE = os.path.join(UPLOAD_FOLDER, "cleaned.csv")
READY_FLAG = os.path.join(UPLOAD_FOLDER, "READY.flag")

# ---------- GEMINI CONFIG ----------
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")


@app.route("/")
def home():
    return "✅ HealthGuard Backend running"


# ---------------- UPLOAD ----------------
@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file.save(RAW_FILE)

    if os.path.exists(READY_FLAG):
        os.remove(READY_FLAG)

    return jsonify({"message": "Uploaded successfully"})


# ---------------- CLEAN ----------------
@app.route("/clean", methods=["POST"])
def clean():
    if not os.path.exists(RAW_FILE):
        return jsonify({"error": "Upload CSV first"}), 400

    df = pd.read_csv(RAW_FILE)
    df.fillna(df.mean(numeric_only=True), inplace=True)
    df.to_csv(CLEAN_FILE, index=False)

    with open(READY_FLAG, "w") as f:
        f.write("ready")

    return jsonify({"message": "Cleaned successfully"})


# ---------------- REVIEW ----------------
@app.route("/review", methods=["GET"])
def review():
    if not os.path.exists(READY_FLAG):
        return jsonify({"error": "Upload & clean CSV first"}), 400

    df = pd.read_csv(CLEAN_FILE)

    return jsonify({
        "shape": {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1])
        },
        "columns": df.dtypes.astype(str).to_dict(),
        "missing": df.isnull().sum().to_dict(),
        "describe": df.describe().round(2).to_dict()
    })


# ---------------- CHAT WITH CSV (GEMINI) ----------------
@app.route("/chat", methods=["POST"])
def chat_with_csv():
    if not os.path.exists(READY_FLAG):
        return jsonify({
            "answer": "❌ Please upload and clean the CSV first."
        }), 400

    data = request.get_json()
    question = data.get("question", "")

    df = pd.read_csv(CLEAN_FILE)

    csv_context = f"""
    Dataset info:
    Rows: {df.shape[0]}
    Columns: {df.columns.tolist()}
    Sample data:
    {df.head(5).to_string()}
    """

    prompt = f"""
    You are a health data analyst.
    Answer the user's question using the CSV data below.

    {csv_context}

    Question: {question}
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        return jsonify({"answer": f"Gemini error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
