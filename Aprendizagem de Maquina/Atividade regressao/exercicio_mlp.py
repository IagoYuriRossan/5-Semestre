# -*- coding: utf-8 -*-
"""Regressão — Algerian Forest Fires (UCI ID 547)
Target (y): FWI — Fire Weather Index (variável contínua, range 0–31.1)
"""

#%% Bibliotecas
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns
import warnings
from sklearn.exceptions import ConvergenceWarning
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.linear_model import LinearRegression
from sklearn import metrics
warnings.filterwarnings("ignore", category=ConvergenceWarning)

#%% Carregar e limpar o CSV
# skiprows=1 pula o título "Bejaia Region Dataset"; a linha 2 é o cabeçalho real.
# Linhas separadoras da 2ª região viram NaN após pd.to_numeric e são removidas.
df = pd.read_csv('Algerian_forest_fires_dataset_UPDATE.csv', skiprows=1)
df = df[[c for c in df.columns if 'class' not in c.strip().lower()]]  # remove coluna Classes
df = df.apply(pd.to_numeric, errors='coerce').dropna().reset_index(drop=True)
print(f"Base carregada: {len(df)} amostras, {df.shape[1]} colunas")
print(df.describe())
input('\nAperte ENTER para definir X e y...')

#%% Definir X (preditoras) e y (target = FWI)
# FWI foi escolhido como target por ser a variável-resumo contínua do sistema FWI.
# Colunas de data (day/month/year) são removidas por não serem preditoras.
y = df['FWI']
X = df.drop(columns=[c for c in df.columns if c.strip().upper() in ['FWI','DAY','MONTH','YEAR']])

print("X:", list(X.columns))
print("y: FWI  (range:", round(y.min(),1), "→", round(y.max(),1), ")")

# Range muito diferente entre variáveis → StandardScaler necessário
print("\nRange das variáveis (min → max):")
for col in X.columns:
    print(f"  {col:12s}: {X[col].min():.1f} → {X[col].max():.1f}")
input('\nAperte ENTER para ver o Pairplot...')

#%% Pairplot — relação entre todas as variáveis X e y
sns.pairplot(pd.concat([X, y], axis=1))
plt.suptitle('Pairplot — Algerian Forest Fires  (y = FWI)', y=1.02)
plt.show()
input('Feche o gráfico e pressione ENTER...')

#%% Divisão treino/teste (80/20) + normalização
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc  = scaler.transform(X_test)
print(f"Treino: {len(X_train)} amostras | Teste: {len(X_test)} amostras")
input('\nAperte ENTER para treinar o MLPRegressor...')

# ============================================================
#  PARTE 1 — MLPRegressor (Rede Neural)
# ============================================================

#%% MLPRegressor — treinar, prever, avaliar
mlp = MLPRegressor(hidden_layer_sizes=(100,), max_iter=2000, random_state=42)
mlp.fit(X_train_sc, y_train)
prev_mlp = mlp.predict(X_test_sc)

plt.figure()
plt.scatter(y_test, prev_mlp)
plt.xlabel('y Test (FWI real)')
plt.ylabel('y Previsto')
plt.title('MLPRegressor — yTest vs. yPred')
plt.show()
input('Feche o gráfico e pressione ENTER...')

mae_mlp = metrics.mean_absolute_error(y_test, prev_mlp)
print(f"\n=== MLPRegressor ===")
print(f"MAE : {mae_mlp:.4f}")
print(f"MSE : {metrics.mean_squared_error(y_test, prev_mlp):.4f}")
print(f"RMSE: {np.sqrt(metrics.mean_squared_error(y_test, prev_mlp)):.4f}")

print(f"\n--- Parâmetros da Rede ---")
print(f"Camadas ocultas   : {mlp.hidden_layer_sizes}")
print(f"Ativação          : {mlp.activation}")
print(f"Épocas (ciclos)   : {mlp.n_iter_}")
print(f"Nº camadas total  : {mlp.n_layers_}")
print(f"Atributos entrada : {mlp.n_features_in_}")
print(f"Ativação saída    : {mlp.out_activation_}")
print(f"Loss final        : {mlp.loss_:.6f}")
input('\nAperte ENTER para treinar a Regressão Linear...')

# ============================================================
#  PARTE 2 — LinearRegression (Estatística)
# ============================================================

#%% LinearRegression — treinar, prever, avaliar
lm = LinearRegression()
lm.fit(X_train_sc, y_train)
prev = lm.predict(X_test_sc)

plt.figure()
plt.scatter(y_test, prev)
plt.xlabel('y Test (FWI real)')
plt.ylabel('y Previsto')
plt.title('LinearRegression — yTest vs. yPred')
plt.show()
input('Feche o gráfico e pressione ENTER...')

mae_lr = metrics.mean_absolute_error(y_test, prev)
print(f"\n=== LinearRegression ===")
print(f"MAE : {mae_lr:.4f}")
print(f"MSE : {metrics.mean_squared_error(y_test, prev):.4f}")
print(f"RMSE: {np.sqrt(metrics.mean_squared_error(y_test, prev)):.4f}")

# Equação multilinear
print(f"\n--- Equação Multilinear ---")
print(f"FWI = {lm.intercept_:.4f}")
for col, coef in zip(X.columns, lm.coef_):
    print(f"      {coef:+.4f} * ({col.strip()})")

# ============================================================
#  RESUMO FINAL
# ============================================================

#%% Resumo comparativo
print(f"\n{'='*38}")
print("RESUMO FINAL".center(38))
print(f"{'='*38}")
print(f"  MAE — MLPRegressor    : {mae_mlp:.4f}")
print(f"  MAE — LinearRegression: {mae_lr:.4f}")
print(f"\n  Menor MAE → {'MLPRegressor' if mae_mlp < mae_lr else 'LinearRegression'}")