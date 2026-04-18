#%% 
# bibliotecas
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neural_network import MLPRegressor
# from sklearn.linear_model import LinearRegression
import warnings

# Ignorar avisos de convergência para manter a saída limpa
warnings.filterwarnings("ignore", category=UserWarning)

#%% 
# 1. Conjunto de dados do mundo real (Horas de Estudo vs. Pontuação no Exame)
# Criamos um conjunto de 20 pontos de dados.
X = np.array([
    [2.5], [5.1], [3.2], [8.5], [3.5], [1.5], [9.2], [5.5], [8.3], [2.7],
    [7.7], [5.9], [4.5], [3.3], [1.1], [8.9], [2.5], [1.9], [6.1], [7.8]
])
y = np.array([
    21, 47, 27, 75, 30, 20, 88, 60, 81, 25,
    85, 62, 41, 42, 17, 95, 30, 24, 67, 86
    ])

#%%
# 2. Rede Neural para Regressão Linear
# Para simular uma regressão linear com uma rede neural, usamos uma configuração simples:
# - Uma camada oculta com um único neurônio.
# - Função de ativação 'identity' que não altera o valor (saída = entrada).
# - O otimizador 'adam' é bom para encontrar os pesos (parâmetros da reta).
# - iniciamos com 1000 ciclos (max_iter) e vamos aumentando para melhorar o desempenho
rede_neural = MLPRegressor(hidden_layer_sizes=(),   # () zero 
                           activation='identity', solver='adam',
                           max_iter=1000, random_state=42, 
                           learning_rate_init=0.01,
                           verbose=True)

#%%
# Treinando o modelo
rede_neural.fit(X, y)


#%%
# Fazendo as previsões para desenhar a reta ajustada
y_pred = rede_neural.predict(X)

#%%
# 3. Parâmetros da Reta Ajustada
# Em uma rede neural simples como esta, o coeficiente (inclinação) e o intercepto
# podem ser extraídos dos pesos e vieses do modelo.
# A equação da reta é: y = (inclinação * x) + intercepto
inclinacao = rede_neural.coefs_[0][0][0]
intercepto = rede_neural.intercepts_[0][0]

print("--- Parâmetros da Reta Ajustada ---")
print(f"Inclinação (m): {inclinacao:.4f}")
print(f"Intercepto (b): {intercepto:.4f}")
print(f"Equação da reta: y = {inclinacao:.4f}x + {intercepto:.4f}\n")

#%%
# 4. Coeficiente de Correlação
# O coeficiente de correlação de Pearson (r) mede a força e a direção
# da relação linear entre duas variáveis. Varia de -1 a 1.
correlacao = np.corrcoef(X.flatten(), y)[0, 1]

print("--- Coeficiente de Correlação ---")
print(f"Coeficiente de Correlação de Pearson (r): {correlacao:.4f}")

#%% 
# parâmetros da rede
# print("\nClasses = ", rede_neural.classes_)     # lista de classes
print("Erro = ", rede_neural.loss_)    # fator de perda (erro)
print("Amostras visitadas = ", rede_neural.t_)     # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", rede_neural.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", rede_neural.n_iter_)      # númerode iterações no treinamento
print("N de camadas = ", rede_neural.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", rede_neural.hidden_layer_sizes)
print("N de neurons saida = ", rede_neural.n_outputs_)   # número de neurons de saida
print("F de ativação = ", rede_neural.out_activation_)  # função de ativação utilizada
print("Matriz de pesos = ", rede_neural.coefs_, rede_neural.intercepts_, )

#%%
# 5. Gráfico dos Dados e Reta Ajustada
plt.figure(figsize=(10, 6))
# Gráfico de dispersão dos dados originais
plt.scatter(X, y, color='blue', label='Dados Reais')
# Plot da reta de regressão ajustada pela rede neural
plt.plot(X, y_pred, color='red', linewidth=2, label='Reta de Regressão (Rede Neural)')
plt.title('Horas de Estudo vs. Pontuação no Exame')
plt.xlabel('Horas de Estudo')
plt.ylabel('Pontuação no Exame')
plt.legend()
plt.grid(True)
plt.show()

