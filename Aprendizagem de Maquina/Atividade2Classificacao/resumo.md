# Atividade 2 — Classificação com Árvores e Florestas

**Disciplina:** Aprendizagem de Máquina | **Base:** Algerian Forest Fires (UCI)

---

## O que o projeto faz

O script `exercicio_dt_rf.py` baixa automaticamente uma base de dados de incêndios florestais na Argélia e treina dois modelos de classificação para prever se houve ou não um incêndio (`fire` / `not fire`).

---

## Modelos utilizados

### 🌳 Árvore de Decisão

- Gera uma árvore de regras que classifica os dados
- Usa **validação cruzada (5 folds)** para escolher a melhor configuração automaticamente
- Exibe a acurácia, o relatório de classificação e um gráfico visual da árvore

### 🌲 Floresta Aleatória

- Conjunto de centenas de árvores treinadas em paralelo
- Também otimizada automaticamente com validação cruzada
- Principal entrega: **ranking de importância das variáveis** — mostra quais fatores climáticos mais influenciam a ocorrência de incêndio

---

## Como rodar

```bash
# Ativar o ambiente virtual
.venv\Scripts\activate

# Rodar o script
python exercicio_dt_rf.py
```

Basta pressionar **ENTER** a cada etapa e **fechar as janelas de gráfico** para continuar.

---

## Saídas

| O que aparece                          | Onde                        |
| -------------------------------------- | --------------------------- |
| Melhores configurações dos modelos     | Console                     |
| Acurácia e relatório de classificação  | Console                     |
| Matriz de confusão (Árvore e Floresta) | Janela gráfica              |
| Plot da Árvore de Decisão              | Janela gráfica              |
| Tabela de importância das variáveis    | Console + gráfico de barras |

---

## Variável alvo

**`Classes`** — indica se houve (`fire`) ou não (`not fire`) incêndio florestal no dia observado.

---

## Principais variáveis preditoras (exemplos esperados)

As variáveis do **FWI (Fire Weather Index)** — `FWI`, `ISI`, `BUI`, `DC` — tendem a ter maior importância, pois são índices diretamente relacionados ao risco de incêndio.
