import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# 1. Conjunto de dados do mundo real (Horas de Estudo vs. Pontuação no Exame)
# Usamos exatamente os mesmos 20 pontos de dados.
X = np.array([
    [2.5], [5.1], [3.2], [8.5], [3.5], [1.5], [9.2], [5.5], [8.3], [2.7],
    [7.7], [5.9], [4.5], [3.3], [1.1], [8.9], [2.5], [1.9], [6.1], [7.8]
])
y = np.array([
    21, 47, 27, 75, 30, 20, 88, 60, 81, 25,
    85, 62, 41, 42, 17, 95, 30, 24, 67, 86
])

# 2. Modelo de Regressão Linear
# Instanciamos o modelo LinearRegression, que é o padrão para esta tarefa.
modelo_linear = LinearRegression()

# Treinando o modelo
modelo_linear.fit(X, y)

# Fazendo as previsões para desenhar a reta ajustada
y_pred = modelo_linear.predict(X)

# 3. Parâmetros da Reta Ajustada
# A forma de acessar os parâmetros é um pouco diferente (e mais direta)
# A equação da reta é: y = (inclinação * x) + intercepto
inclinacao = modelo_linear.coef_[0]
intercepto = modelo_linear.intercept_

print("--- Parâmetros da Reta Ajustada (com LinearRegression) ---")
print(f"Inclinação (m): {inclinacao:.4f}")
print(f"Intercepto (b): {intercepto:.4f}")
print(f"Equação da reta: y = {inclinacao:.4f}x + {intercepto:.4f}\n")

# 4. Coeficiente de Correlação
# O cálculo é o mesmo, pois depende apenas dos dados originais.
correlacao = np.corrcoef(X.flatten(), y)[0, 1]

print("--- Coeficiente de Correlação ---")
print(f"Coeficiente de Correlação de Pearson (r): {correlacao:.4f}")

# 5. Gráfico dos Dados e Reta Ajustada
plt.figure(figsize=(10, 6))
# Gráfico de dispersão dos dados originais
plt.scatter(X, y, color='blue', label='Dados Reais')
# Plot da reta de regressão ajustada pelo modelo linear
plt.plot(X, y_pred, color='green', linewidth=2, label='Reta de Regressão (LinearRegression)')
plt.title('Horas de Estudo vs. Pontuação no Exame')
plt.xlabel('Horas de Estudo')
plt.ylabel('Pontuação no Exame')
plt.legend()
plt.grid(True)
plt.show()
