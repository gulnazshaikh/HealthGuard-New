from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# paths
CURRENT_FILE_PATH = None
CLEANED_FILE_PATH = os.path.join(UPLOAD_FOLDER, "cleaned_file.csv")


@app.route("/")
def home():
    return "✅ HealthGuard API is running!"


# ----------------- Upload CSV -----------------
@app.route("/upload", methods=["POST"])
def upload_csv():
    global CURRENT_FILE_PATH
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        save_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(save_path)
        CURRENT_FILE_PATH = save_path

        # preview
        df = pd.read_csv(save_path)
        preview = df.head(10).to_dict(orient="records")

        return jsonify({
            "message": "Uploaded successfully",
            "filename": file.filename,
            "columns": df.columns.tolist(),
            "data": preview
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ----------------- Clean CSV -----------------
@app.route("/clean", methods=["POST"])
def clean_csv():
    global CURRENT_FILE_PATH, CLEANED_FILE_PATH
    try:
        if CURRENT_FILE_PATH is None:
            return jsonify({"error": "No data uploaded"}), 400

        df = pd.read_csv(CURRENT_FILE_PATH)

        # 1) trim whitespace
        for col in df.select_dtypes(include="object").columns:
            df[col] = df[col].astype(str).str.strip()

        # 2) replace invalid zeros
        critical_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
        for col in critical_cols:
            if col in df.columns:
                df[col] = df[col].replace(0, np.nan)

        # 3) fill NaNs with mean for numeric cols
        df.fillna(df.mean(numeric_only=True), inplace=True)

        # 4) drop duplicates
        df = df.drop_duplicates().reset_index(drop=True)

        # save cleaned file
        df.to_csv(CLEANED_FILE_PATH, index=False)
        CURRENT_FILE_PATH = CLEANED_FILE_PATH

        return jsonify({
            "message": "Cleaned successfully",
            "columns": df.columns.tolist(),
            "data": df.head(10).to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ----------------- Download Cleaned CSV -----------------
@app.route("/download-cleaned", methods=["GET"])
def download_cleaned():
    try:
        if os.path.exists(CLEANED_FILE_PATH):
            return send_file(
                CLEANED_FILE_PATH,
                as_attachment=True,
                download_name="cleaned_file.csv"
            )
        return jsonify({"error": "Cleaned file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ----------------- Quick Review -----------------
@app.route("/review", methods=["GET"])
def quick_review():
    try:
        if not os.path.exists(CLEANED_FILE_PATH):
            return jsonify({"error": "No cleaned file found. Upload and clean first."}), 400

        df = pd.read_csv(CLEANED_FILE_PATH)

        describe = {}
        try:
            num_desc = df.describe(include=[np.number]).to_dict()
            cat_desc = df.describe(include=["object"]).to_dict()
            describe.update(num_desc)
            describe.update(cat_desc)
        except Exception:
            describe = df.describe().to_dict()

        missing = df.isnull().sum().to_dict()
        dtypes = {c: str(t) for c, t in df.dtypes.items()}

        return jsonify({
            "message": "Review generated",
            "shape": {"rows": int(df.shape[0]), "columns": int(df.shape[1])},
            "columns": df.columns.tolist(),
            "dtypes": dtypes,
            "missing_values": missing,
            "describe": describe
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Chat with CSV -----------------
@app.route("/chat", methods=["POST"])
def chat_with_csv():
    try:
        if not os.path.exists(CLEANED_FILE_PATH):
            return jsonify({"answer": "❌ Please upload and clean a CSV first."}), 400

        df = pd.read_csv(CLEANED_FILE_PATH)
        data = request.get_json()
        question = data.get("question", "").lower()

        if "row" in question:
            answer = f"The dataset has {df.shape[0]} rows."
        elif "column" in question:
            answer = f"The dataset has {df.shape[1]} columns: {', '.join(df.columns)}"
        elif "missing" in question:
            missing = df.isnull().sum().sum()
            answer = f"There are {missing} missing values in the dataset."
        elif "mean" in question:
            nums = df.select_dtypes(include=np.number).mean().to_dict()
            answer = f"Column means: {nums}"
        else:
            answer = "⚠️ I can answer about rows, columns, missing values, and means."

        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"answer": f"Error: {str(e)}"}), 500


# ----------------- Visualization APIs -----------------

@app.route("/visualize", methods=["GET"])
def visualize_data():
    """Single API to send all visualization data at once"""
    if not os.path.exists(CLEANED_FILE_PATH):
        return jsonify({"error": "No cleaned file found"}), 400

    df = pd.read_csv(CLEANED_FILE_PATH)

    try:
        # 1) Outcome distribution
        outcome_counts = df["Outcome"].value_counts().to_dict() if "Outcome" in df.columns else {}

        # 2) Glucose distribution
        if "Glucose" in df.columns:
            bins = [0, 80, 120, 160, 200, 300]
            labels = ["<80", "80-120", "120-160", "160-200", "200+"]
            df["GlucoseRange"] = pd.cut(df["Glucose"], bins=bins, labels=labels, include_lowest=True)
            glucose_counts = df["GlucoseRange"].value_counts().to_dict()
        else:
            glucose_counts = {}

        # 3) BMI distribution
        if "BMI" in df.columns:
            def categorize_bmi(bmi):
                if bmi < 18.5: return "Underweight"
                elif 18.5 <= bmi < 25: return "Normal"
                elif 25 <= bmi < 30: return "Overweight"
                else: return "Obese"
            df["BMI_Category"] = df["BMI"].apply(categorize_bmi)
            bmi_counts = df["BMI_Category"].value_counts().to_dict()
        else:
            bmi_counts = {}

        # 4) Age vs Insulin
        if "Age" in df.columns and "Insulin" in df.columns:
            age_insulin = df.groupby("Age")["Insulin"].mean().reset_index().to_dict(orient="records")
        else:
            age_insulin = []

        # 5) Correlation matrix
        corr = df.corr(numeric_only=True).round(2).to_dict()

        return jsonify({
            "outcome_counts": outcome_counts,
            "glucose_counts": glucose_counts,
            "bmi_counts": bmi_counts,
            "age_insulin": age_insulin,
            "correlation": corr
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)