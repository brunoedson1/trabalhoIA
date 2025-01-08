from busca_utils import transferir, estado_inicial, objetivo, CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C

def busca_irrevogavel():
    """
    Resolve o problema sem retroceder (não verifica estados anteriores).
    """
    estado = estado_inicial
    print("Início:", estado)

    # Passo 1: A -> C
    estado = (transferir(estado[0], estado[2], CAPACIDADE_C)[0], estado[1], transferir(estado[0], estado[2], CAPACIDADE_C)[1])
    print("Após transferir de A para C:", estado)

    # Passo 2: A -> B
    estado = (transferir(estado[0], estado[1], CAPACIDADE_B)[0], transferir(estado[0], estado[1], CAPACIDADE_B)[1], estado[2])
    print("Após transferir de A para B:", estado)

    # Passo 3: B -> C
    estado = (estado[0], transferir(estado[1], estado[2], CAPACIDADE_C)[0], transferir(estado[1], estado[2], CAPACIDADE_C)[1])
    print("Após transferir de B para C:", estado)

    # Passo 4: A -> C
    estado = (transferir(estado[0], estado[2], CAPACIDADE_C)[0], estado[1], transferir(estado[0], estado[2], CAPACIDADE_C)[1])
    print("Após transferir de A para C:", estado)

    # Passo 5: C -> B
    estado = (estado[0], transferir(estado[2], estado[1], CAPACIDADE_B)[1], transferir(estado[2], estado[1], CAPACIDADE_B)[0])
    print("Após transferir de C para B:", estado)

    # Passo 6: B -> A
    estado = (transferir(estado[1], estado[0], CAPACIDADE_A)[1], transferir(estado[1], estado[0], CAPACIDADE_A)[0], estado[2])
    print("Após transferir de B para A:", estado)

    # Passo 7: C -> B
    estado = (estado[0], transferir(estado[2], estado[1], CAPACIDADE_B)[1], transferir(estado[2], estado[1], CAPACIDADE_B)[0])
    print("Após transferir de C para B:", estado)

    # Passo 8: A -> C
    estado = (transferir(estado[0], estado[2], CAPACIDADE_C)[0], estado[1], transferir(estado[0], estado[2], CAPACIDADE_C)[1])
    print("Após transferir de A para C:", estado)

    print("Estado final:", estado)
    if estado == objetivo:
        print("Objetivo alcançado!")
    else:
        print("Falha em alcançar o objetivo.")


# Teste da Busca Irrevogável
if __name__ == "__main__":
    print("\n=== Testando Busca Irrevogável ===")
    busca_irrevogavel()
