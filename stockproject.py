import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from keras.optimizers import Adam
from keras.metrics import MeanAbsoluteError
from keras.losses import MeanSquaredError

#functions for calculating features
def calculate_ema(prices, days):
    return prices.ewm(span=days).mean()

def calculate_macd(prices):
    ema12 = calculate_ema(prices, 12)
    ema26 = calculate_ema(prices, 26)
    return ema12 - ema26

def calculate_rsi(prices, days=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=days).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=days).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def collect_and_process_stock_data(stock_symbol, start_date, end_date):
    stock_data = yf.download(stock_symbol, start=start_date, end=end_date)
    stock_data['EMA_10'] = calculate_ema(stock_data['Close'], 10)
    stock_data['MACD'] = calculate_macd(stock_data['Close'])
    stock_data['RSI'] = calculate_rsi(stock_data['Close'])
    stock_data['Volume'] = stock_data['Volume'] / max(stock_data['Volume'])
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_features = scaler.fit_transform(stock_data[['Close', 'EMA_10', 'MACD', 'RSI', 'Volume']].fillna(0))
    
    return scaled_features, stock_data, scaler

def prepare_data_for_lstm(scaled_data, time_step=60):
    X_train, y_train = [], []
    for i in range(time_step, len(scaled_data)):
        X_train.append(scaled_data[i-time_step:i])
        y_train.append(scaled_data[i, 0])  
    X_train, y_train = np.array(X_train), np.array(y_train)
    return X_train, y_train

#collects and processes stock data
scaled_data, processed_data, scaler = collect_and_process_stock_data('AAPL', '2022-01-01', '2024-03-31') #enter stock data here (stock tag and timestamps)
X_train_full, X_test, y_train_full, y_test = train_test_split(scaled_data, processed_data['Close'], test_size=0.2, shuffle=False)
X_train, y_train = prepare_data_for_lstm(X_train_full)
X_test, y_test = prepare_data_for_lstm(X_test)

#model is defined here
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
    Dropout(0.2),
    LSTM(50),
    Dropout(0.2),
    Dense(1)
])

#compiles the model
model.compile(optimizer=Adam(), loss=MeanSquaredError(), metrics=[MeanAbsoluteError()])

#trains model and evaluates results
history = model.fit(X_train, y_train, epochs=100, batch_size=25, validation_split=0.1)
eval_result = model.evaluate(X_test, y_test)
print(f"Test Loss: {eval_result[0]}, Test MAE: {eval_result[1]}")

#generates predictions for each day of last 20% of dataset
predictions = model.predict(X_test)
temp_predictions_array = np.zeros((predictions.shape[0], 5))  #5 features
temp_predictions_array[:, 0] = predictions.ravel()  
inv_predictions = scaler.inverse_transform(temp_predictions_array)[:, 0]  #inverse transformations to get 'Close' prices

temp_y_test_array = np.zeros((y_test.shape[0], 5))
temp_y_test_array[:, 0] = y_test.ravel()
inv_y_test = scaler.inverse_transform(temp_y_test_array)[:, 0]  

#eval metrics defintions using predictions
mse = np.mean(np.square(inv_y_test - inv_predictions))
mae = np.mean(np.abs(inv_y_test - inv_predictions))
mape = np.mean(np.abs((inv_y_test - inv_predictions) / inv_y_test)) * 100

print(f"MSE: {mse:.2f}, MAE: {mae:.2f}, MAPE: {mape:.2f}%")

#outputs whether to buy or sell based on inverse transformed predictions
decisions = ["Buy" if inv_predictions[i + 1] > inv_predictions[i] else "Sell" for i in range(len(inv_predictions) - 1)]
for i, decision in enumerate(decisions):
    print(f"Day {i + 1}: Predicted: {inv_predictions[i]:.2f}, Actual: {inv_y_test[i]:.2f}, Decision: {decision}")

last_60_days_scaled = scaled_data[-60:]  #extracts last 60 days in dataset
last_60_days_scaled = last_60_days_scaled.reshape((1, 60, 5)) 

#predicts stock for next day after end of dataset
next_day_prediction_scaled = model.predict(last_60_days_scaled)

#inverse transforms predictions back to scale
temp_array = np.zeros((1, 5)) 
temp_array[:, 0] = next_day_prediction_scaled.ravel()  #fills only first feature w/ prediction
next_day_prediction = scaler.inverse_transform(temp_array)[:, 0]  

#outputs next day's predicted price
if next_day_prediction_scaled[0] > inv_predictions[-1]:
    next_day_decision = "Buy"
else:
    next_day_decision = "Sell"

print(f"Next Day's Prediction: {next_day_prediction[0]:.2f}, Decision: {next_day_decision}")