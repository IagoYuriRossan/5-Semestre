#%% A REDE NEURAL AGORA É UTILIZADA 
# PARA REALIZAR REGRESSÃO MULTILINEAR COM SCIKIT-LEARN
# 
# Importar bibliotecas necessárias
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error

#%% Carregar a base de dados Wine Quality da UCI
url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv'
df = pd.read_csv(url, sep=';')

# Definir a variável de saída (qualidade do vinho)
y = df['quality']

# Definir as variáveis de entrada (características do vinho)
X = df.drop('quality', axis=1)

#%% Separar em conjunto de treinamento e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalizar as variáveis de entrada
# A lógica de normalização é a mesma
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

#%% Construir e treinar a rede neural com MLPRegressor
# A definição do modelo e o treinamento são feitos de forma mais direta
model = MLPRegressor(
    hidden_layer_sizes=(64,),      # Uma camada oculta com 64 neurônios
    activation='relu',             # Usando 'relu' que é mais comum e performático que 'sigmoid'
    solver='adam',
    max_iter=50,                   # Equivalente a 'epochs'
    batch_size=32,
    verbose=True,
    random_state=42,
    early_stopping=True,           # Habilita parada antecipada para evitar overfitting
    validation_fraction=0.1        # Usa 10% dos dados de treino para validação interna
)

# O treinamento é feito com uma única chamada ao método .fit()
model.fit(X_train, y_train)

#%% Avaliar o modelo
# A previsão é feita com .predict()
y_pred = model.predict(X_test)

# O Scikit-learn tem funções prontas para calcular as métricas
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print(f'\nResultados da Avaliação:')
print(f'MSE (Mean Squared Error): {mse:.2f}')
print(f'MAE (Mean Absolute Error): {mae:.2f}')


#%% Prever para um vinho desconhecido
'''
    1 - acidez fixa
    2 - acidez volátil
    3 - ácido cítrico
    4 - açúcar residual
    5 - cloretos
    6 - dióxido de enxofre livre
    7 - dióxido de enxofre total
    8 - densidade
    9 - pH
    10 - sulfatos
    11 - álcool
'''
# Vinho desconhecido com as medições
x_prev_dados_originais = np.array([[ 7.0, 0.5, 0.2, 2.0, 0.07, 10.0, 50.0, 0.991, 3.3, 0.55, 10.0 ]])

# IMPORTANTE: O modelo foi treinado com dados normalizados.
# Devemos aplicar a mesma normalização aos novos dados antes de prever.
x_prev_normalizado = scaler.transform(x_prev_dados_originais)

# Realizar a previsão
y_prev = model.predict(x_prev_normalizado)

print(f"\nNota prevista para o vinho desconhecido: {y_prev[0]:.2f}")

# %%
