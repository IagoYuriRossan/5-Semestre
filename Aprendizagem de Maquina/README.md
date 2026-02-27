# Aprendizagem de Máquina - 5º Semestre

Projeto da disciplina de Aprendizagem de Máquina.

---

## 📚 Bibliotecas Instaladas

### **numpy**
- Faz cálculos matemáticos rápidos com muitos números ao mesmo tempo
- Exemplo: ao invés de somar 1000 números um por um, faz tudo de uma vez
- Essencial para manipulação de arrays e matrizes

### **pandas**
- Trabalha com dados em formato de tabela (como planilhas do Excel)
- Usado para carregar, limpar e analisar datasets
- Facilita a leitura de arquivos CSV e manipulação de dados

### **scikit-learn**
- Tem os algoritmos de Machine Learning prontos
- Exemplo: classificação, regressão, clustering (agrupamento)
- É tipo uma "caixa de ferramentas" com tudo pronto

### **matplotlib**
- Cria gráficos bonitos
- Exemplo: gráficos de linhas, barras, pizza, dispersão
- Ajuda a visualizar os resultados dos seus modelos

---

## 📁 Estrutura do Projeto

```
Aprendizagem de Maquina/
├── notebooks/    ← Coloque aqui seus Jupyter Notebooks (.ipynb)
├── scripts/      ← Coloque aqui seus códigos Python (.py)
├── data/         ← Coloque aqui seus datasets (arquivos .csv, .txt)
├── models/       ← Aqui ficam os modelos treinados salvos
├── .venv/        ← Ambiente virtual (não mexer!)
├── requirements.txt
├── .gitignore
└── README.md
```

### Por que organizar assim?
- **notebooks/**: Para fazer experimentos e análises interativas
- **scripts/**: Para códigos finalizados e reutilizáveis
- **data/**: Mantém todos os dados organizados em um só lugar
- **models/**: Salva modelos treinados para usar depois sem precisar treinar de novo

---

## 🔧 O que é o Ambiente Virtual (.venv)?

Imagine que é uma "caixa isolada" para o seu projeto.

### Por que precisamos?
- Cada projeto pode ter suas próprias bibliotecas sem conflitar com outros projetos
- É como ter uma gaveta separada para cada matéria da faculdade
- Se você instalar uma biblioteca aqui, ela não afeta outros projetos ou o Python principal do seu computador

### Como funciona?
- Uma pasta chamada `.venv` foi criada automaticamente
- Dentro dela tem uma cópia "privada" do Python só para este projeto
- Todas as bibliotecas ficam guardadas lá dentro

---

## 🚀 Como Usar

### 1. Ativar o ambiente virtual

**Windows (PowerShell ou CMD):**
```bash
.venv\Scripts\activate
```

**Windows (Git Bash):**
```bash
source .venv/Scripts/activate
```

Quando ativado, você verá `(.venv)` no início da linha do terminal.

### 2. Usar as bibliotecas

Crie um arquivo Python e importe:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import datasets
```

### 3. Instalar bibliotecas novamente (se necessário)

Se você compartilhar o projeto com colegas:

```bash
pip install -r requirements.txt
```

### 4. Desativar o ambiente virtual (quando terminar)

```bash
deactivate
```

---

## 📝 Arquivos Especiais

### **requirements.txt**
- É uma "lista de compras" das bibliotecas que o projeto precisa
- Se você compartilhar o projeto com colegas ou o professor, eles podem instalar tudo de uma vez

### **.gitignore**
- Diz ao Git (sistema de controle de versão) o que NÃO salvar
- Não salva a pasta `.venv` porque ela é muito grande e pode ser recriada
- Também não salva arquivos temporários do Python (`__pycache__`)

---

## 💡 Analogia Simples

Pense assim:
- **Ambiente Virtual (.venv)** = Sua mochila da faculdade
- **Bibliotecas (numpy, pandas, scikit-learn, matplotlib)** = Seus cadernos e livros dentro da mochila
- **Pastas (notebooks/, scripts/, data/)** = Divisórias da mochila para organizar cada matéria
- **requirements.txt** = Lista do material escolar que você precisa comprar

---

## 🎯 Exemplo Rápido de Código

```python
import pandas as pd
import numpy as np

# Criar um conjunto de dados simples
dados = {
    'nome': ['Ana', 'Bruno', 'Carlos'],
    'nota': [8.5, 9.0, 7.5]
}

df = pd.DataFrame(dados)
print(df)
```

---

## ⚙️ Ambiente Técnico

- Python 3.14.2
- Ambiente virtual configurado em `.venv/`
- Bibliotecas gerenciadas via pip

---

**Tudo pronto para você começar seus projetos de Aprendizagem de Máquina! 🚀**
