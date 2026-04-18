#%%
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Gerar dados aleatórios para os atributos de entrada
np.random.seed(0)
x1 = np.random.rand(500)
x2 = np.random.rand(500)

# Gerar o atributo de saída como uma função multilinear dos atributos de entrada com ruído
y = 2 * x1 + 3 * x2 + np.random.randn(500) / 2

#%% Criar um gráfico 3D do atributo de saída contra os atributos de entrada
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(projection='3d')
ax.scatter(x1, x2, y, c=y, cmap='viridis')
ax.set_xlabel('Atributo 1')
ax.set_ylabel('Atributo 2')
ax.set_zlabel('Atributo de Saída')
plt.show()

# Realizar uma regressão multilinear
X = np.column_stack((x1, x2))
modelo = LinearRegression()
modelo.fit(X, y)

# Obter os coeficientes da regressão
coef_x1 = modelo.coef_[0]
coef_x2 = modelo.coef_[1]
intercept = modelo.intercept_

print(f"Coeficiente de x1: {coef_x1}")
print(f"Coeficiente de x2: {coef_x2}")
print(f"Intercept: {intercept}")

#%% Gerar um gráfico do atributo de saída contra os atributos de entrada com a linha de regressão
x1_grid = np.linspace(0, 1, 100)
x2_grid = np.linspace(0, 1, 100)
x1_grid_rep = np.repeat(x1_grid, 100)
x2_grid_tile = np.tile(x2_grid, 100)
X_grid = np.column_stack((x1_grid_rep, x2_grid_tile))
y_pred_grid = modelo.predict(X_grid)

# Plotar a malha de previsão
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(projection='3d')
ax.scatter(x1, x2, y, c=y, cmap='viridis', label='Dados')
x1_grid, x2_grid = np.meshgrid(x1_grid, x2_grid)
y_pred_grid = y_pred_grid.reshape(100, 100)
ax.plot_surface(x1_grid, x2_grid, y_pred_grid, cmap='coolwarm', alpha=0.5, label='Regressão')
ax.set_xlabel('Atributo 1')
ax.set_ylabel('Atributo 2')
ax.set_zlabel('Atributo de Saída')
plt.legend()
plt.show()

# %% # Calcular a reta de regressão para x1 no plano (x1, y)
modelo_x1 = LinearRegression()
modelo_x1.fit(x1.reshape(-1, 1), y)
y_pred_x1 = modelo_x1.predict(x1.reshape(-1, 1))

# Calcular a reta de regressão para x2 no plano (x2, y)
modelo_x2 = LinearRegression()
modelo_x2.fit(x2.reshape(-1, 1), y)
y_pred_x2 = modelo_x2.predict(x2.reshape(-1, 1))

# Plotar os gráficos x1 vs. y e y_pred_x1 no plano (x1, y) e outro gráfico x2 vs. y e y_pred_x2 no plano (x2, y)
fig, axs = plt.subplots(1, 2, figsize=(12, 6))

axs[0].scatter(x1, y, label='Dados')
axs[0].plot(x1, y_pred_x1, 'r', label='Regressão')
axs[0].set_xlabel('Atributo 1')
axs[0].set_ylabel('Atributo de Saída')
axs[0].legend()

axs[1].scatter(x2, y, label='Dados')
axs[1].plot(x2, y_pred_x2, 'r', label='Regressão')
axs[1].set_xlabel('Atributo 2')
axs[1].set_ylabel('Atributo de Saída')
axs[1].legend()

plt.show()

# %%
