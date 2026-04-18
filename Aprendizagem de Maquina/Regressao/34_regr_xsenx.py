#%%
# aprender a função x*sin(x)
# e prever um novo valor por regressão não-linear com Scikit-learn

import numpy as np
import matplotlib.pyplot as plt
from sklearn.neural_network import MLPRegressor

#%%
# Gerar dados para treinamento (exatamente o mesmo)
np.random.seed(42) # Adicionado para reprodutibilidade
x = np.linspace(-10, 10, 1000)
# Adicionado um pouco mais de ruído para tornar o desafio mais interessante
y = x * np.sin(x) + np.random.normal(0, 0.5, 1000)

# Scikit-learn espera que X seja uma matriz 2D
x_treino = x.reshape(-1, 1)
# y pode ser um vetor 1D, o que é mais comum no scikit-learn
y_treino = y

print(x_treino.shape, y_treino.shape)

#%% 
# Criar modelo 1-H1-H2-1 com MLPRegressor
# A arquitetura é definida em 'hidden_layer_sizes'
H1 = H2 = 64
modelo = MLPRegressor(
    hidden_layer_sizes=(H1, H2), # Duas camadas ocultas com 64 neurônios cada
    activation='relu',             # Função de ativação ReLU
    solver='adam',                 # Otimizador
    max_iter=200,                  # Equivalente a 'epochs'
    verbose=True,                  # Mostra o progresso do treinamento
    random_state=42,               # Garante que os resultados sejam reproduzíveis
    learning_rate_init=0.001,      # Taxa de aprendizado inicial (padrão do Adam)
    n_iter_no_change=10            # Para o treino se a perda não melhorar
)


#%% Treinar modelo
# O treinamento é feito com uma única chamada ao método .fit()
modelo.fit(x_treino, y_treino)

# A perda (loss) ao longo do treinamento pode ser acessada com o atributo loss_curve_
print("\nHistórico da perda (MSE) a cada iteração:")
# print(modelo.loss_curve_) # Descomente para ver a lista completa

# Plotar a curva de aprendizado
plt.figure(figsize=(10, 5))
plt.plot(modelo.loss_curve_)
plt.title("Curva de Aprendizado (Loss vs. Iterações)")
plt.xlabel("Iteração (Época)")
plt.ylabel("Mean Squared Error (Loss)")
plt.grid(True)
plt.show()


#%% 
# Prever valores
x_previsao = np.array([-7, -5, -2, 0, 3, 5, 10]).reshape(-1, 1)
y_previsao = modelo.predict(x_previsao)

print("\nPrevisões (usando range e índice):")
# Itera pelos índices, de 0 até o número de previsões - 1
for i in range(len(y_previsao)):
    # Usa o índice 'i' para acessar o elemento em cada array
    x_val = x_previsao[i][0]
    y_val = y_previsao[i]
    print(f"x = {x_val}, y = {y_val:.2f}")


#%% 
# parâmetros da rede
# print("\nClasses = ", modelo.classes_)     # lista de classes
print("Erro = ", modelo.loss_)    # fator de perda (erro)
print("Amostras visitadas = ", modelo.t_)     # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", modelo.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", modelo.n_iter_)      # númerode iterações no treinamento
print("N de camadas = ", modelo.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", modelo.hidden_layer_sizes)
print("N de neurons saida = ", modelo.n_outputs_)   # número de neurons de saida
print("F de ativação = ", modelo.out_activation_)  # função de ativação utilizada
print("Matriz de pesos = ", modelo.coefs_, modelo.intercepts_, )


#%% Plotar dados e previsões
plt.figure(figsize=(10, 6))
plt.plot(x, y, '.', label='Dados Ruidosos', alpha=0.3)
plt.plot(x, x * np.sin(x), label='Função Original x*sin(x)', color='gray', linestyle='--')
plt.plot(x_previsao, y_previsao, label='Previsões Pontuais', marker='o', color='red', markersize=8, linestyle='None')
plt.legend()
plt.title("Dados Originais e Previsões Pontuais")
plt.show()


#%% Plotar a função aprendida pelo modelo
plt.figure(figsize=(10, 6))
x_range = np.linspace(-10, 10, 200).reshape(-1, 1)
y_range = modelo.predict(x_range)

plt.plot(x, y, '.', label='Dados Ruidosos', alpha=0.3)
plt.plot(x, x * np.sin(x), label='Função Original x*sin(x)', color='gray', linestyle='--')
plt.plot(x_range, y_range, label='Função Aprendida pelo Modelo', color='red', linewidth=3)
plt.legend()
plt.title("Função Aprendida pelo Modelo Scikit-learn")
plt.show()

