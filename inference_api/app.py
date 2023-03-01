import joblib
from flask import Flask, request
from operator import itemgetter
app = Flask(__name__)

extreme_gb = './models/ExtremeGB.pkl'
gradient_boost = './models/GradientBoost.pkl'
knn = './models/KNN.pkl'
light_gb = './models/lightGB.pkl'
linear_regression = './models/LinearRegression.pkl'
random_forest = './models/RandomForest.pkl'
svm = './models/SVM.pkl'

model_dict = {
    "EXTREME_GB": extreme_gb,
    "GRADIENT_BOOST": gradient_boost,
    "KNN": knn,
    "LIGHT_GB": light_gb,
    "LINEAR_REGRESSION": linear_regression,
    "RANDOM_FOREST": random_forest,
    "SVM": svm
}

@app.get("/models")
def get_models():
    """Returns the list of models available for prediction."""
    keys_list = list(model_dict.keys())
    return keys_list

@app.post("/predict")
def predict():
    """Predicts the output based on selected model and parameters.
    
    model: str
    line_space: int
    scanning_velocity: int
    depth: int
    """
    try:
        request_body = request.get_json()
        model, line_space, scanning_velocity, depth = itemgetter(
            'model', 'line_space', 'scanning_velocity', 'depth'
            )(request_body)
        model_path = model_dict.get(model)
        assert model_path is not None
        loaded_model = joblib.load(model_path)
        result = loaded_model.predict([[line_space, scanning_velocity, depth]])
        assert len(result) == 1
        response = {
            "model_payload": request_body,
            "prediction": str(result[0])
        }
        return response
    except KeyError as err:
        print(err)
        return {
            "status_code": 400,
            "message": "Invalid request body"
        }