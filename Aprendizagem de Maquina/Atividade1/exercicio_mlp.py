"""
NESTA VERSÃO, O CONJUNTO DE DADOS SERÁ LIDO LOCALMENTE E DIVIDIDO EM TREINAMENTO E TESTE.
O SCRIPT IRÁ ITERAR SOBRE VÁRIAS ARQUITETURAS DE REDE E EXIBIR A MATRIZ DE CONFUSÃO 
GRÁFICA PARA CADA UMA DELAS.
"""
#%% BIBLIOTECAS

# python -m pip install scikit-learn pandas matplotlib

from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split   # separa treinamento e teste
from sklearn.metrics import accuracy_score, confusion_matrix # avaliar desempenho
from sklearn.preprocessing import StandardScaler # normalização dos dados
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay
import warnings
from sklearn.exceptions import ConvergenceWarning

# Ocultar avisos de convergência para deixar o terminal limpo
warnings.filterwarnings("ignore", category=ConvergenceWarning)

#%% CARGA DOS DADOS

'''
Base de dados: Clickstream Data for Online Shopping
Carregamento via arquivo local (.csv)

Variável de saída (Alvo/Target): 
   'price 2' - Variável binária (1 ou 2) que indica se o preço do 
   produto clicado é maior que a média da categoria.
'''

print("Carregando base de dados Clickstream do arquivo local...")
df = pd.read_csv('e-shop clothing 2008.csv', sep=';')

# Segurança: Converter o nome de todas as colunas para minúsculo
df.columns = df.columns.str.lower().str.strip()

# Amostragem: Usando 10% da base para agilizar os testes
df = df.sample(frac=0.10, random_state=42)

# Separação de Atributos (X) e Alvo (y)
y = df['price 2']
# Removendo colunas que causam vazamento de dados ou não ajudam
X = df.drop(columns=['price 2', 'price', 'session id', 'year'])
X = pd.get_dummies(X)

print('\nMATRIZ DOS DADOS DE ENTRADA (Amostra 10%)\n', X.head())      
input('\nAperte ENTER para continuar:')
print('\nVETOR DAS CLASSES (Target)\n', y.head())
input('\nAperte ENTER para continuar:')


#%% DIVIDA O CONJUNTO DE DADOS EM TREINAMENTO E TESTE

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    ## test_size=0.2 = 20% dos dados para teste
    ## random_state=42 = "semente" para iniciar o selecionador aleatório

# Normalização (Muito importante para o MLP convergir corretamente)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nFormato dados de treinamento:", X_train_scaled.shape, y_train.shape)
print("Formato dados de teste:", X_test_scaled.shape, y_test.shape)
input('\nAperte ENTER para iniciar os testes com diferentes arquiteturas:')


#%% Tente diferentes combinações de camadas e neurônios (E GERAR MATRIZES)

arquiteturas = [(10,), (20,), (50,), (100,), (200,), (10, 10), (20, 20), (50, 50)]

melhor_acuracia = 0
melhor_mlp = None

for tam_camada_oculta in arquiteturas:
    print(f"\n" + "="*40)
    print(f"Treinando Arquitetura: {tam_camada_oculta}")
    print("="*40)
    
    mlp = MLPClassifier(hidden_layer_sizes = tam_camada_oculta, 
                        max_iter=1000,   # default=200
                        random_state=42,
                        early_stopping=True) # Para se parar de melhorar
    
    # Executa treinamento
    mlp.fit(X_train_scaled, y_train)
    
    # Faça previsões
    y_pred = mlp.predict(X_test_scaled)
    
    # Avalie o desempenho do modelo
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Épocas até parar: {mlp.n_iter_}")
    print(f"Acurácia com {tam_camada_oculta} neurons: {accuracy:.4f}")
    
    # Guardando a melhor rede para exibir no final
    if accuracy > melhor_acuracia:
        melhor_acuracia = accuracy
        melhor_mlp = mlp

    # Calcular a matriz de confusão
    cm = confusion_matrix(y_test, y_pred)
    print("\nMatriz de Confusão (Texto):")
    print(cm)

    # REPRESENTAÇÃO GRÁFICA DA MATRIZ DE CONFUSÃO
    print("\n--> Uma janela com o gráfico foi aberta.")
    print("--> FECHE A JANELA DO GRÁFICO PARA CONTINUAR PARA A PRÓXIMA RODADA.")
    
    display = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=mlp.classes_)
    display.plot(cmap=plt.cm.Blues) # cmap altera a cor para tons de azul
    plt.title(f"Matriz de Confusao - Arquitetura: {tam_camada_oculta}")
    
    # O comando plt.show() pausa a execução do código até você fechar a janela
    plt.show() 

input('\nTodas as rodadas foram concluídas! Aperte ENTER para ver os dados da MELHOR rede:')


#%% ALGUNS PARÂMETROS DA MELHOR REDE ENCONTRADA

print("\n" + "="*50)
print("PARÂMETROS INTERNOS DA MELHOR REDE".center(50))
print("="*50)
print(f"Configuração vencedora: {melhor_mlp.hidden_layer_sizes}\n")

print("Classes = ", melhor_mlp.classes_)      # lista de classes
print("Erro (Loss final) = ", melhor_mlp.loss_)    # fator de perda (erro)
print("Amostras visitadas = ", melhor_mlp.t_)      # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", melhor_mlp.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", melhor_mlp.n_iter_)       # númerode iterações no treinamento
print("N de camadas = ", melhor_mlp.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", melhor_mlp.hidden_layer_sizes)
print("N de neurons saida = ", melhor_mlp.n_outputs_)   # número de neurons de saida
print("F de ativação = ", melhor_mlp.out_activation_)  # função de ativação utilizada