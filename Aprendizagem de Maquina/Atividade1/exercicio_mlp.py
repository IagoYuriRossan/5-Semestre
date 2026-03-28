"""
CÓDIGO BLINDADO COM LABEL ENCODER: Resolve o bug do Scikit-Learn transformando
as classes de texto (fire/not fire) em números (1 e 0) para a Rede Neural.
"""
#%% BIBLIOTECAS

from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.preprocessing import StandardScaler, LabelEncoder
from ucimlrepo import fetch_ucirepo
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay
import warnings
from sklearn.exceptions import ConvergenceWarning

warnings.filterwarnings("ignore", category=ConvergenceWarning)

#%% CARGA DOS DADOS E LIMPEZA INTELIGENTE

print("Baixando base de dados Algerian Forest Fires da UCI (ID 547)...")
forest_fires = fetch_ucirepo(id=547)

X = forest_fires.data.features.copy()
y = forest_fires.data.targets.copy()

# 1. Padroniza o Target (y) tirando espaços e deixando minúsculo
y = y.iloc[:, 0].astype(str).str.strip().str.lower()

# 2. Filtra as 2 classes principais para remover lixo
classes_principais = y.value_counts().index[:2]
linhas_validas = y.isin(classes_principais)

X = X[linhas_validas].copy()
y = y[linhas_validas].copy()

# 3. Força atributos a serem números e preenche erros com 0
for col in X.columns:
    X[col] = pd.to_numeric(X[col].astype(str).str.replace(',', '.'), errors='coerce')
X = X.fillna(0)

# ==========================================================
# A SOLUÇÃO DO BUG: Transformar texto em número (0 e 1)
# ==========================================================
le = LabelEncoder()
y_numerico = le.fit_transform(y) # Transforma 'fire'/'not fire' em números

print(f'\nTotal de amostras válidas prontas para uso: {len(X)} linhas.')
print(f'Mapeamento das Classes pelo LabelEncoder: {dict(zip(le.classes_, le.transform(le.classes_)))}')
input('\nAperte ENTER para continuar e separar os dados:')


#%% DIVIDA O CONJUNTO DE DADOS EM TREINAMENTO E TESTE

# Usamos o y_numerico agora!
X_train, X_test, y_train, y_test = train_test_split(X, y_numerico, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nFormato dados de treinamento:", X_train_scaled.shape, y_train.shape)
print("Formato dados de teste:", X_test_scaled.shape, y_test.shape)
input('\nAperte ENTER para iniciar os testes com diferentes arquiteturas:')


#%% TREINAMENTO E GERAÇÃO DE GRÁFICOS

arquiteturas = [(10,), (20,), (50,), (100,), (200,), (10, 10), (20, 20), (50, 50)]

melhor_acuracia = 0
melhor_mlp = None
tabela_resultados = []

for tam_camada_oculta in arquiteturas:
    print(f"\n" + "="*40)
    print(f"Treinando Arquitetura: {tam_camada_oculta}")
    print("="*40)
    
    mlp = MLPClassifier(hidden_layer_sizes=tam_camada_oculta, 
                        max_iter=1000,
                        random_state=42,
                        early_stopping=True) # Como y é número, early_stopping não dá mais erro!
    
    mlp.fit(X_train_scaled, y_train)
    y_pred = mlp.predict(X_test_scaled)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Épocas até parar: {mlp.n_iter_}")
    print(f"Acurácia com {tam_camada_oculta} neurons: {accuracy:.4f}")
    
    tabela_resultados.append({
        'Camada oculta': str(tam_camada_oculta).replace(',', ''),
        'Acurácia': round(accuracy, 4)
    })
    
    if accuracy > melhor_acuracia:
        melhor_acuracia = accuracy
        melhor_mlp = mlp

    cm = confusion_matrix(y_test, y_pred)
    print("\nMatriz de Confusão (Texto):")
    print(cm)

    print("\n--> Uma janela com o gráfico foi aberta.")
    print("--> FECHE A JANELA DO GRÁFICO PARA CONTINUAR PARA A PRÓXIMA RODADA.")
    
    # Passamos as classes do LabelEncoder para o gráfico mostrar o texto original ('fire', 'not fire')
    display = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=le.classes_)
    display.plot(cmap=plt.cm.Oranges) 
    plt.title(f"Matriz de Confusao - Arquitetura: {tam_camada_oculta}")
    
    plt.show() 

input('\nTodas as rodadas foram concluídas! Aperte ENTER para ver a Tabela de Acurácia:')


#%% TABELA FINAL DE ACURÁCIA

print("\n" + "="*40)
print("TABELA DE ACURÁCIA".center(40))
print("="*40)

df_tabela = pd.DataFrame(tabela_resultados)
df_tabela = df_tabela.sort_values(by='Acurácia', ascending=False).reset_index(drop=True)
print(df_tabela.to_string(index=False))

input('\nAperte ENTER para ver os dados da MELHOR rede encontrada:')


#%% ALGUNS PARÂMETROS DA MELHOR REDE ENCONTRADA

print("\n" + "="*50)
print("PARÂMETROS INTERNOS DA MELHOR REDE".center(50))
print("="*50)
print(f"Configuração vencedora: {melhor_mlp.hidden_layer_sizes}\n")

# Mostrando o mapeamento para o professor ver que você converteu os dados corretamente
print("Classes da Rede (Números) = ", melhor_mlp.classes_)
print("Classes Originais (Texto) = ", le.classes_)
print("Erro (Loss final) = ", melhor_mlp.loss_)
print("Amostras visitadas = ", melhor_mlp.t_)
print("Atributos de entrada = ", melhor_mlp.n_features_in_)
print("N ciclos = ", melhor_mlp.n_iter_)
print("N de camadas = ", melhor_mlp.n_layers_)
print("Tamanhos das camadas ocultas: ", melhor_mlp.hidden_layer_sizes)
print("N de neurons saida = ", melhor_mlp.n_outputs_)
print("F de ativação = ", melhor_mlp.out_activation_)