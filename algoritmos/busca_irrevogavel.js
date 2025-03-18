import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, PESO_A, PESO_B, PESO_C, estadoInicial, objetivo} from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca Irrevogável usando DFS
export function buscaIrrevogavel() {
    // Conjunto para rastrear estados visitados
    const visitados = new Set();
    const arvore = [];
    const caminhos = [];

    // Função recursiva para a busca
    function dfs(estado, caminho, pai, custoTotal) {
        const estadoString = estado.join(',');

        // Verificar se o estado já foi visitado
        if (visitados.has(estadoString)) {
            return false;
        }

        // Marcar estado como visitado
        visitados.add(estadoString);

        // Adicionar o nó à árvore
        arvore.push({ estado, pai, transicao: caminho.length > 0 ? caminho[caminho.length - 1] : null, custo: custoTotal });

        // Verificar se o objetivo foi alcançado
        if (estado[0] === objetivo[0] && estado[1] === objetivo[1] && estado[2] === objetivo[2]) {
            caminhos.push({ caminho: [...caminho], custo: custoTotal }); // Armazenar o caminho encontrado
            return true; // Objetivo alcançado
        }

        // Possíveis transferências com pesos
        const transferencias = [
            ["A -> B", PESO_A, () => {
                const [novoA, novoB] = transferir(estado[0], estado[1], CAPACIDADE_B);
                return [novoA, novoB, estado[2]];
            }],
            ["A -> C", PESO_A, () => {
                const [novoA, novoC] = transferir(estado[0], estado[2], CAPACIDADE_C);
                return [novoA, estado[1], novoC];
            }],
            ["B -> A", PESO_B, () => {
                const [novoB, novoA] = transferir(estado[1], estado[0], CAPACIDADE_A);
                return [novoA, novoB, estado[2]];
            }],
            ["B -> C", PESO_B, () => {
                const [novoB, novoC] = transferir(estado[1], estado[2], CAPACIDADE_C);
                return [estado[0], novoB, novoC];
            }],
            ["C -> A", PESO_C, () => {
                const [novoC, novoA] = transferir(estado[2], estado[0], CAPACIDADE_A);
                return [novoA, estado[1], novoC];
            }],
            ["C -> B", PESO_C, () => {
                const [novoC, novoB] = transferir(estado[2], estado[1], CAPACIDADE_B);
                return [estado[0], novoB, novoC];
            }]
        ];

        // Explorar todas as transferências possíveis
        for (const [nome, peso, transferencia] of transferencias) {
            const novoEstado = transferencia();
            if (dfs(novoEstado, [...caminho, nome], estadoString, custoTotal + peso)) {
                return true; // Encerra a busca se o objetivo for alcançado
            }
        }

        return false; // Continua a busca
    }

    // Iniciar busca a partir do estado inicial
    if (!dfs(estadoInicial, [], null, 0)) {
        console.log("Falha em alcançar o objetivo.");
    }

    return { arvore, caminhos }; // Retorna a árvore gerada e todos os caminhos encontrados
}