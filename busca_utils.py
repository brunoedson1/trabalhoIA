# busca_utils.py
# Utilitários compartilhados entre os algoritmos de busca do problema dos galões de água

# Capacidade dos galões
CAPACIDADE_A = 8
CAPACIDADE_B = 5
CAPACIDADE_C = 3

# Estado inicial e objetivo
estado_inicial = (8, 0, 0)
objetivo = (4, 4, 0)

def transferir(origem, destino, capacidade_destino):
    """
    Transfere água de um galão para outro.
    Retorna os novos valores de origem e destino.
    """
    espaco_disponivel = capacidade_destino - destino
    transferido = min(origem, espaco_disponivel)
    return origem - transferido, destino + transferido
