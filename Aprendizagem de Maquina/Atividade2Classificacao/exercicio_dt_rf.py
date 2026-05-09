"""
Exercício: Árvores de Decisão e Florestas Aleatórias

Base: Algerian Forest Fires (UCI ID 547)
Seguir formato do `exercicio_mlp.py` na pasta Atividade1.
"""
#%% BIBLIOTECAS

from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
from ucimlrepo import fetch_ucirepo
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay
import warnings
from sklearn.exceptions import ConvergenceWarning

warnings.filterwarnings("ignore", category=ConvergenceWarning)

#%% CARGA DOS DADOS E PRÉ-PROCESSAMENTO (SEM NORMALIZAÇÃO NECESSÁRIA PARA ÁRVORES)

print("Baixando base de dados Algerian Forest Fires da UCI (ID 547)...")
forest_fires = fetch_ucirepo(id=547)

X = forest_fires.data.features.copy()
y = forest_fires.data.targets.copy()

# 1. Padroniza o Target (y) tirando espaços e deixando minúsculo
y = y.iloc[:, 0].astype(str).str.strip().str.lower()

# 2. Filtra as 2 classes principais para remover rótulos raros
classes_principais = y.value_counts().index[:2]
linhas_validas = y.isin(classes_principais)

X = X[linhas_validas].copy()
y = y[linhas_validas].copy()

# 3. Força atributos a serem números e preenche erros com 0
for col in X.columns:
    X[col] = pd.to_numeric(X[col].astype(str).str.replace(',', '.'), errors='coerce')
X = X.fillna(0)

# Transformar texto em números (LabelEncoder)
le = LabelEncoder()
y_numerico = le.fit_transform(y)

print(f'\nTotal de amostras válidas prontas para uso: {len(X)} linhas.')
print(f'Mapeamento das Classes pelo LabelEncoder: {dict(zip(le.classes_, le.transform(le.classes_)))}')
input('\nAperte ENTER para continuar e separar os dados:')

#%% DIVIDA O CONJUNTO DE DADOS

X_train, X_test, y_train, y_test = train_test_split(X, y_numerico, test_size=0.2, random_state=42, stratify=y_numerico)

print("\nFormato dados de treinamento:", X_train.shape, y_train.shape)
print("Formato dados de teste:", X_test.shape, y_test.shape)
input('\nAperte ENTER para iniciar busca por hiperparâmetros (validação cruzada) e treinar a Árvore de Decisão:')

#%% ÁRVORE DE DECISÃO (GridSearchCV + validação cruzada)

dt_param_grid = {
    'max_depth': [None, 5, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

dt_grid = GridSearchCV(DecisionTreeClassifier(random_state=42), dt_param_grid, cv=5, scoring='accuracy', n_jobs=-1)
dt_grid.fit(X_train, y_train)

print('\nMelhores hiperparâmetros (Árvore):', dt_grid.best_params_)
print(f"Melhor score CV (Árvore): {dt_grid.best_score_:.4f}")

# usa o melhor estimador encontrado
dt = dt_grid.best_estimator_

# Avaliação no conjunto de teste
y_pred_dt = dt.predict(X_test)
acc_dt = accuracy_score(y_test, y_pred_dt)

print("\n" + "="*40)
print("RESULTADOS - ÁRVORE DE DECISÃO".center(40))
print("="*40)
print(f"Acurácia (teste): {acc_dt:.4f}")
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred_dt, target_names=le.classes_))

cm_dt = confusion_matrix(y_test, y_pred_dt)
display_dt = ConfusionMatrixDisplay(confusion_matrix=cm_dt, display_labels=le.classes_)
display_dt.plot(cmap=plt.cm.Oranges)
plt.title("Matriz de Confusão - Árvore de Decisão")
plt.show()

print("\nPlotando a árvore (pode ser grande). Feche a figura para continuar.")
plt.figure(figsize=(20, 10))
plot_tree(dt, feature_names=X.columns, class_names=le.classes_, filled=True, fontsize=8)
plt.title("Árvore de Decisão")
plt.show()

input('\nAperte ENTER para iniciar busca por hiperparâmetros e treinar a Floresta Aleatória:')

#%% FLORESTA ALEATÓRIA

#%% FLORESTA ALEATÓRIA (GridSearchCV)

rf_param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20],
    'max_features': ['sqrt', 'log2']
}

rf_grid = GridSearchCV(RandomForestClassifier(random_state=42, n_jobs=-1), rf_param_grid, cv=5, scoring='accuracy', n_jobs=-1)
rf_grid.fit(X_train, y_train)

print('\nMelhores hiperparâmetros (Floresta):', rf_grid.best_params_)
print(f"Melhor score CV (Floresta): {rf_grid.best_score_:.4f}")

# usa o melhor estimador encontrado
rf = rf_grid.best_estimator_

y_pred_rf = rf.predict(X_test)
acc_rf = accuracy_score(y_test, y_pred_rf)

print("\n" + "="*40)
print("RESULTADOS - FLORESTA ALEATÓRIA".center(40))
print("="*40)
print(f"Acurácia (teste): {acc_rf:.4f}")
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred_rf, target_names=le.classes_))

cm_rf = confusion_matrix(y_test, y_pred_rf)
display_rf = ConfusionMatrixDisplay(confusion_matrix=cm_rf, display_labels=le.classes_)
display_rf.plot(cmap=plt.cm.Oranges)
plt.title("Matriz de Confusão - Floresta Aleatória")
plt.show()

# Importâncias das variáveis
feat_imp = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
})
feat_imp = feat_imp.sort_values(by='importance', ascending=False).reset_index(drop=True)

print('\nImportância das variáveis (top 20):')
print(feat_imp.head(20).to_string(index=False))

plt.figure(figsize=(10, 6))
plt.barh(feat_imp['feature'].head(20)[::-1], feat_imp['importance'].head(20)[::-1], color='steelblue')
plt.xlabel('Importância')
plt.title('Top 20 Importância das Variáveis - Floresta Aleatória')
plt.tight_layout()
plt.show()

print('\nExecução concluída. Verifique as figuras e os resultados acima.')
