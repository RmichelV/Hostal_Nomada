from flask import Flask, request, jsonify
from prophet import Prophet
import pandas as pd
from pandas.plotting import register_matplotlib_converters
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_reservations():
    # Aquí deberías recibir los datos, pero para simplificar usaré datos de ejemplo
    register_matplotlib_converters()

    data = pd.read_json("reservations.json")

    data['reservation_date'] = pd.to_datetime(data['reservation_date'])

    data.set_index('reservation_date', inplace=True)

    data = data.sort_index()
    df = data.reset_index()
    df.columns = ['ds', 'y']
    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=90)
    forecast = model.predict(future)

    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(90).to_dict(orient='records')
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
