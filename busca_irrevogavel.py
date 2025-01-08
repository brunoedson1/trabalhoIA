from busca_utils import transferir, estado_inicial, objetivo, CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C

def busca_irrevogavel():
    """
    Resolve o problema de forma sistemática sem retroceder. Explora sequências de transferências de forma controlada.
    """
    # Inicia com o estado inicial
    estado = estado_inicial
    print("Início:", estado)

    # Define as transferências possíveis
    transferencias = [
        ("A -> B", lambda e: (transferir(e[0], e[1], CAPACIDADE_B)[0], transferir(e[0], e[1], CAPACIDADE_B)[1], e[2])),
        ("A -> C", lambda e: (transferir(e[0], e[2], CAPACIDADE_C)[0], e[1], transferir(e[0], e[2], CAPACIDADE_C)[1])),
        ("B -> A", lambda e: (transferir(e[1], e[0], CAPACIDADE_A)[1], transferir(e[1], e[0], CAPACIDADE_A)[0], e[2])),
        ("B -> C", lambda e: (e[0], transferir(e[1], e[2], CAPACIDADE_C)[0], transferir(e[1], e[2], CAPACIDADE_C)[1])),
        ("C -> A", lambda e: (transferir(e[2], e[0], CAPACIDADE_A)[1], e[1], transferir(e[2], e[0], CAPACIDADE_A)[0])),
        ("C -> B", lambda e: (e[0], transferir(e[2], e[1], CAPACIDADE_B)[1], transferir(e[2], e[1], CAPACIDADE_B)[0])),
    ]
    
    # Passo 1: Explorar as transferências até encontrar o objetivo
    visited = set()  # Para evitar estados repetidos

    def dfs(estado, caminho):
        # Verificar se o estado já foi visitado
        if estado in visited:
            return False
        
        # Marcar estado como visitado
        visited.add(estado)

        # Exibir caminho e estado atual
        print(f"Caminho: {caminho} | Estado: {estado}")
        
        # Verificar se o objetivo foi alcançado
        if estado == objetivo:
            print("Objetivo alcançado!")
            return True

        # Explorar todas as transferências possíveis
        for nome, transferencia in transferencias:
            novo_estado = transferencia(estado)
            if dfs(novo_estado, caminho + [nome]):
                return True
        
        return False

    # Iniciar busca em profundidade
    if not dfs(estado, []):
        print("Falha em alcançar o objetivo.")

# Teste da Busca Irrevogável
if __name__ == "__main__":
    print("\n=== Testando Busca Irrevogável ===")
    busca_irrevogavel()
