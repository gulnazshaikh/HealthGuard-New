from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import h2o
from h2o.automl import H2OAutoML

# ---------------- INIT H2O ----------------
h2o.init(max_mem_size="2G")

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

RAW_FILE = os.path.join(UPLOAD_FOLDER, "raw.csv")
CLEAN_FILE = os.path.join(UPLOAD_FOLDER, "cleaned.csv")
READY_FLAG = os.path.join(UPLOAD_FOLDER, "READY.flag")


# ---------------- HOME ----------------
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

    # Basic cleaning
    df.drop_duplicates(inplace=True)
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
@app.route("/visualize", methods=["GET"])
def visualize():
    if not os.path.exists(CLEAN_FILE):
        return jsonify({"error": "Please upload and clean CSV first"}), 400

    df = pd.read_csv(CLEAN_FILE)
    column = request.args.get("column")

    if not column:
        return jsonify({
            "columns": df.columns.tolist()
        })

    if column not in df.columns:
        return jsonify({"error": "Invalid column selected"}), 400

    value_counts = df[column].value_counts().head(5)
    pie = [{"name": str(k), "value": int(v)} for k, v in value_counts.items()]
    bar = pie

    line = [
        {"name": str(i), "value": float(v)}
        for i, v in enumerate(df[column].head(10))
        if pd.notnull(v)
    ]

    corr = df.corr(numeric_only=True).fillna(0)

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
@app.route("/train-model", methods=["POST"])
def train_model():

    if not os.path.exists(CLEAN_FILE):
        return jsonify({"error": "Please upload and clean CSV first"}), 400

    data = request.get_json()
    target = data.get("target")

    if not target:
        return jsonify({"error": "Target column required"}), 400

    try:
        # Load data into H2O
        hf = h2o.import_file(CLEAN_FILE)

        if target not in hf.columns:
            return jsonify({"error": "Invalid target column"}), 400

        # Convert target to categorical (classification)
        hf[target] = hf[target].asfactor()

        # Train/Test split
        train, test = hf.split_frame(ratios=[0.8], seed=1234)

        x = hf.columns[:]
        x.remove(target)

        # AutoML
        aml = H2OAutoML(
            max_models=5,
            seed=1,
            balance_classes=True,
            exclude_algos=["DeepLearning", "StackedEnsemble"]
        )

        aml.train(x=x, y=target, training_frame=train)

        leader = aml.leader

        # Leaderboard
        leaderboard = aml.leaderboard.as_data_frame().head(5)
        leaderboard = leaderboard.to_dict(orient="records")

        # Performance on test
        perf = leader.model_performance(test)

        metrics = {
            "Accuracy": float(perf.accuracy()[0][1]),
            "AUC": float(perf.auc()),
            "F1": float(perf.F1()[0][1]),
            "LogLoss": float(perf.logloss())
        }

        # Feature Importance
        try:
            fi = leader.varimp(use_pandas=True).head(10)
            feature_importance = fi.to_dict(orient="records")
        except:
            feature_importance = []

        # Model Summary (safe)
        try:
            summary = leader.summary().as_data_frame()
            summary = summary.to_dict(orient="records")
        except:
            summary = []

        return jsonify({
            "leaderboard": leaderboard,
            "summary": summary,
            "metrics": metrics,
            "feature_importance": feature_importance
        })

    except Exception as e:
        print("🔥 TRAIN ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)