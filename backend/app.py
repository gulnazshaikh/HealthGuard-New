from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

import h2o
from h2o.automl import H2OAutoML

h2o.init()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

RAW_FILE = os.path.join(UPLOAD_FOLDER, "raw.csv")
CLEAN_FILE = os.path.join(UPLOAD_FOLDER, "cleaned.csv")
READY_FLAG = os.path.join(UPLOAD_FOLDER, "READY.flag")


@app.route("/")
def home():
    return "✅ Backend is running perfectly"


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


# ---------------- QUICK REVIEW ----------------
@app.route("/review", methods=["GET"])
def review():
    if not os.path.exists(READY_FLAG):
        return jsonify({"error": "upload_and_clean_first"}), 400

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


# ---------------- VISUALIZATION ----------------
# ---------------- VISUALIZATION ----------------
@app.route("/visualize", methods=["GET"])
def visualize():
    # check cleaned data
    if not os.path.exists(CLEAN_FILE):
        return jsonify({"error": "Please upload and clean CSV first"}), 400

    df = pd.read_csv(CLEAN_FILE)

    # column from query
    column = request.args.get("column")

    # FIRST LOAD → only column list
    if not column:
        return jsonify({
            "columns": df.columns.tolist()
        })

    # invalid column safety
    if column not in df.columns:
        return jsonify({"error": "Invalid column selected"}), 400

    # ---------------- PIE & BAR (distribution) ----------------
    value_counts = df[column].value_counts().head(5)
    pie = [
        {"name": str(k), "value": int(v)}
        for k, v in value_counts.items()
    ]
    bar = pie  # same distribution

    # ---------------- LINE (trend) ----------------
    line = [
        {"name": str(i), "value": float(v)}
        for i, v in enumerate(df[column].head(10))
        if pd.notnull(v)
    ]

    # ---------------- HEATMAP (correlation) ----------------
    corr = df.corr(numeric_only=True).fillna(0)

    #corr = df.corr(numeric_only=True)
    heatmap = {
        "x": corr.columns.tolist(),
        "y": corr.columns.tolist(),
        "z": corr.values.tolist()
    }

    return jsonify({
        "columns": df.columns.tolist(),
        "pie": pie,
        "bar": bar,
        "line": line,
        "heatmap": heatmap
    })


# ---------------- TRAIN MODEL ----------------
# ---------------- TRAIN MODEL ----------------
# ---------------- TRAIN MODEL ----------------
@app.route("/train-model", methods=["POST"])
def train_model():

    data = request.json
    target = data.get("target")

    if not os.path.exists(RAW_FILE):
        return jsonify({"error": "CSV not uploaded"}), 400

    if not target:
        return jsonify({"error": "Target column required"}), 400

    # Auto Clean
    df_pd = pd.read_csv(RAW_FILE)
    df_pd.fillna(df_pd.mean(numeric_only=True), inplace=True)
    df_pd.to_csv(CLEAN_FILE, index=False)

    with open(READY_FLAG, "w") as f:
        f.write("ready")

    df = h2o.import_file(CLEAN_FILE)

    if target not in df.columns:
        return jsonify({"error": "Invalid target column"}), 400

    x = df.columns
    x.remove(target)

    aml = H2OAutoML(
        max_models=5,
        seed=1,
        exclude_algos=["DeepLearning"]
    )

    aml.train(x=x, y=target, training_frame=df)

    lb = aml.leaderboard.as_data_frame().head(5)

    return jsonify({
        "message": "Model trained successfully",
        "leaderboard": lb.to_dict(orient="records")
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)

app.py