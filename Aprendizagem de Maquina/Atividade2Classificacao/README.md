# Atividade 2 — Árvores de Decisão e Florestas Aleatórias

> **Disciplina:** Aprendizagem de Máquina — 5º Semestre  
> **Base de dados:** Algerian Forest Fires Dataset (UCI ID 547)  
> **Script principal:** `exercicio_dt_rf.py`

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Base de dados](#base-de-dados)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Pré-requisitos e instalação](#pré-requisitos-e-instalação)
5. [Como executar](#como-executar)
6. [Pipeline detalhado do código](#pipeline-detalhado-do-código)
   - [1. Carregamento e limpeza dos dados](#1-carregamento-e-limpeza-dos-dados)
   - [2. Codificação do alvo (LabelEncoder)](#2-codificação-do-alvo-labelencoder)
   - [3. Divisão treino/teste](#3-divisão-treinoteste)
   - [4. Árvore de Decisão com GridSearchCV](#4-árvore-de-decisão-com-gridsearchcv)
   - [5. Floresta Aleatória com GridSearchCV](#5-floresta-aleatória-com-gridsearchcv)
   - [6. Importância das variáveis](#6-importância-das-variáveis)
7. [Saídas geradas](#saídas-geradas)
8. [Hiperparâmetros buscados](#hiperparâmetros-buscados)
9. [Métricas avaliadas](#métricas-avaliadas)
10. [Dependências](#dependências)

---

## Visão geral

Este projeto implementa dois algoritmos clássicos de aprendizagem de máquina supervisionada para **classificação binária**:

| Algoritmo                                         | Objetivo no exercício                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| **Árvore de Decisão** (`DecisionTreeClassifier`)  | Gerar a árvore que classifica se houve ou não incêndio florestal           |
| **Floresta Aleatória** (`RandomForestClassifier`) | Ordenar as variáveis preditoras por importância em relação à variável alvo |

Ambos os modelos passam por **busca exaustiva de hiperparâmetros** via `GridSearchCV` com **validação cruzada de 5 folds** (`cv=5`) antes de serem avaliados no conjunto de teste, garantindo escolhas de configuração mais robustas e generalizáveis.

---

## Base de dados

**Algerian Forest Fires Dataset**  
Fonte: [UCI Machine Learning Repository — ID 547](https://archive.ics.uci.edu/dataset/547/algerian+forest+fires+dataset)

| Atributo            | Tipo           | Descrição                             |
| ------------------- | -------------- | ------------------------------------- |
| `região`            | Categórico     | Bejaia ou Sidi-Bel Abbes              |
| `dia`, `mês`, `ano` | Inteiro        | Data da observação                    |
| `Temperatura`       | Inteiro        | Temperatura ao meio-dia (°C)          |
| `RH`                | Inteiro        | Umidade relativa (%)                  |
| `Ws`                | Inteiro        | Velocidade do vento (km/h)            |
| `Chuva`             | Contínuo       | Precipitação (mm)                     |
| `FFMC`              | Contínuo       | Código de Umidade de Combustível Fino |
| `DMC`               | Contínuo       | Código de Umidade Duff                |
| `DC`                | Contínuo       | Código Seca                           |
| `ISI`               | Contínuo       | Índice de Dispersão Inicial           |
| `BUI`               | Contínuo       | Índice de Acumulação                  |
| `FWI`               | Contínuo       | Índice de Tempo de Incêndio           |
| **`Classes`**       | **Categórico** | **Alvo: `fire` / `not fire`**         |

- **Total de amostras:** ~244 registros válidos (após filtragem de rótulos raros)
- **Valores faltantes:** nenhum declarado na fonte original; o script converte entradas não numéricas para `NaN` e preenche com `0`

---

## Estrutura do projeto

```
Atividade2Classificacao/
├── exercicio_dt_rf.py   # Script principal
├── requirements.txt     # Dependências do projeto
├── README.md            # Documentação técnica detalhada (este arquivo)
├── resumo.md            # Resumo sucinto para apresentação
└── .venv/               # Ambiente virtual Python (gerado localmente)
```

---

## Pré-requisitos e instalação

### Python

Requer **Python 3.9+** (testado com Python 3.14).

### Ambiente virtual (recomendado)

```bash
# 1. Criar o ambiente virtual na pasta do projeto
python -m venv .venv

# 2. Ativar (Windows)
.venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt
```

### Instalação manual (dependência por dependência)

```bash
pip install scikit-learn
pip install ucimlrepo
pip install pandas
pip install matplotlib
```

---

## Como executar

Com o ambiente virtual ativado:

```bash
python exercicio_dt_rf.py
```

Ou diretamente pelo executável do `.venv`:

```bash
.venv/Scripts/python.exe exercicio_dt_rf.py
```

O script é **interativo**: pressione `ENTER` a cada etapa para avançar. As janelas de gráfico devem ser **fechadas manualmente** para que a execução continue.

---

## Pipeline detalhado do código

### 1. Carregamento e limpeza dos dados

```python
forest_fires = fetch_ucirepo(id=547)
X = forest_fires.data.features.copy()
y = forest_fires.data.targets.copy()
```

- `fetch_ucirepo` baixa os dados diretamente da API da UCI via rede.
- As colunas de `X` são convertidas para tipo numérico com `pd.to_numeric(..., errors='coerce')`, tratando vírgulas decimais (`','` → `'.'`).
- Valores que não puderem ser convertidos viram `NaN` e são preenchidos com `0` via `fillna(0)`.
- O target `y` é normalizado: espaços removidos e texto convertido para minúsculo (`str.strip().str.lower()`).
- Apenas as **2 classes mais frequentes** são mantidas, eliminando possíveis rótulos espúrios presentes na base.

### 2. Codificação do alvo (LabelEncoder)

```python
le = LabelEncoder()
y_numerico = le.fit_transform(y)
```

`LabelEncoder` transforma rótulos de texto (`'fire'`, `'not fire'`) em inteiros (`1`, `0`). Isso é necessário porque o `MLPClassifier` e alguns métodos internos do `GridSearchCV` exigem targets numéricos para funcionar corretamente com `early_stopping`.

O mapeamento completo é impresso em tela para rastreabilidade:

```
Mapeamento das Classes pelo LabelEncoder: {'fire': 1, 'not fire': 0}
```

### 3. Divisão treino/teste

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y_numerico, test_size=0.2, random_state=42, stratify=y_numerico
)
```

| Parâmetro      | Valor        | Justificativa                                  |
| -------------- | ------------ | ---------------------------------------------- |
| `test_size`    | 0.2          | 20% para teste, 80% para treino                |
| `random_state` | 42           | Reprodutibilidade                              |
| `stratify`     | `y_numerico` | Mantém proporção das classes em treino e teste |

> Árvores de decisão **não requerem normalização** dos dados — ao contrário de redes neurais e SVMs. Por isso, `StandardScaler` **não é aplicado** aqui.

### 4. Árvore de Decisão com GridSearchCV

```python
dt_param_grid = {
    'max_depth': [None, 5, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

dt_grid = GridSearchCV(DecisionTreeClassifier(random_state=42),
                       dt_param_grid, cv=5, scoring='accuracy', n_jobs=-1)
dt_grid.fit(X_train, y_train)
dt = dt_grid.best_estimator_
```

- **`GridSearchCV`** realiza busca exaustiva: testa todas as combinações dos parâmetros listados.
- **`cv=5`**: cada combinação é avaliada com validação cruzada estratificada de 5 folds sobre o conjunto de treino.
- **`scoring='accuracy'`**: a combinação com maior acurácia média nos 5 folds é escolhida.
- **`n_jobs=-1`**: paraleliza o processamento usando todos os núcleos disponíveis.
- `best_estimator_` retorna o modelo já treinado com os melhores hiperparâmetros.

**Hiperparâmetros buscados:**

| Parâmetro           | Valores testados  | O que controla                                       |
| ------------------- | ----------------- | ---------------------------------------------------- |
| `max_depth`         | `None`, 5, 10, 20 | Profundidade máxima da árvore (controla overfitting) |
| `min_samples_split` | 2, 5, 10          | Mínimo de amostras para dividir um nó                |
| `min_samples_leaf`  | 1, 2, 4           | Mínimo de amostras em uma folha                      |

Total de combinações: **4 × 3 × 3 = 36 combinações × 5 folds = 180 treinamentos**.

### 5. Floresta Aleatória com GridSearchCV

```python
rf_param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20],
    'max_features': ['sqrt', 'log2']
}

rf_grid = GridSearchCV(RandomForestClassifier(random_state=42, n_jobs=-1),
                       rf_param_grid, cv=5, scoring='accuracy', n_jobs=-1)
rf_grid.fit(X_train, y_train)
rf = rf_grid.best_estimator_
```

A `RandomForest` é um **ensemble de árvores de decisão independentes** treinadas em subconjuntos aleatórios dos dados (bagging) e das features (feature subsampling). A predição final é feita por votação majoritária.

**Hiperparâmetros buscados:**

| Parâmetro      | Valores testados   | O que controla                          |
| -------------- | ------------------ | --------------------------------------- |
| `n_estimators` | 100, 200           | Número de árvores na floresta           |
| `max_depth`    | `None`, 10, 20     | Profundidade máxima de cada árvore      |
| `max_features` | `'sqrt'`, `'log2'` | Nº de features consideradas por divisão |

Total: **2 × 3 × 2 = 12 combinações × 5 folds = 60 treinamentos**.

### 6. Importância das variáveis

```python
feat_imp = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values(by='importance', ascending=False)
```

`feature_importances_` na Floresta Aleatória é calculado como a **média da redução de impureza de Gini** (MDI — Mean Decrease in Impurity) ponderada pelo número de amostras que passam por cada nó, ao longo de todas as árvores. Valores maiores indicam variáveis mais determinantes para a classificação.

---

## Saídas geradas

| Saída                             | Descrição                                                |
| --------------------------------- | -------------------------------------------------------- |
| Console: mapeamento das classes   | Mostra a codificação `LabelEncoder`                      |
| Console: shape treino/teste       | Confirma a divisão dos dados                             |
| Console: melhores hiperparâmetros | Resultado do `GridSearchCV` para cada modelo             |
| Console: score CV                 | Acurácia média na validação cruzada                      |
| Console: acurácia no teste        | Acurácia no conjunto de teste reservado                  |
| Console: classification report    | Precisão, recall e F1 por classe                         |
| Figura 1                          | Matriz de confusão — Árvore de Decisão                   |
| Figura 2                          | Plot visual da Árvore de Decisão (nós, divisões, folhas) |
| Figura 3                          | Matriz de confusão — Floresta Aleatória                  |
| Console: tabela de importâncias   | Top 20 variáveis por `feature_importances_`              |
| Figura 4                          | Gráfico de barras horizontais com top 20 importâncias    |

---

## Hiperparâmetros buscados

### Árvore de Decisão

| Parâmetro           | Grid                |
| ------------------- | ------------------- |
| `max_depth`         | `[None, 5, 10, 20]` |
| `min_samples_split` | `[2, 5, 10]`        |
| `min_samples_leaf`  | `[1, 2, 4]`         |

### Floresta Aleatória

| Parâmetro      | Grid               |
| -------------- | ------------------ |
| `n_estimators` | `[100, 200]`       |
| `max_depth`    | `[None, 10, 20]`   |
| `max_features` | `['sqrt', 'log2']` |

---

## Métricas avaliadas

| Métrica      | Definição                                             |
| ------------ | ----------------------------------------------------- |
| **Acurácia** | (VP + VN) / total de amostras                         |
| **Precisão** | VP / (VP + FP) — quão confiável é quando prevê `fire` |
| **Recall**   | VP / (VP + FN) — quão bem detecta os incêndios reais  |
| **F1-Score** | Média harmônica entre Precisão e Recall               |
| **Score CV** | Acurácia média nos 5 folds de validação cruzada       |

> VP = Verdadeiro Positivo, VN = Verdadeiro Negativo, FP = Falso Positivo, FN = Falso Negativo

---

## Dependências

| Pacote         | Versão mínima | Uso                             |
| -------------- | ------------- | ------------------------------- |
| `scikit-learn` | 1.3+          | Modelos, GridSearchCV, métricas |
| `ucimlrepo`    | 0.0.3+        | Download automático da base UCI |
| `pandas`       | 1.5+          | Manipulação de DataFrames       |
| `matplotlib`   | 3.6+          | Visualizações e gráficos        |
