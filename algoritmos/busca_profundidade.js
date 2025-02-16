import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca em Profundidade (DFS)
export function buscaProfundidade() {
    // Pilha para armazenar os estados a serem explorados
    const pilha = [[estadoInicial, [], null]]; // [estadoAtual, caminhoAtual, pai]
    // Conjunto para rastrear estados visitados
    const visitados = new Set();
    const arvore = [];

    // Enquanto houver estados na pilha
    while (pilha.length > 0) {
        // Retirar o último estado da pilha (LIFO)
        const [estadoAtual, caminhoAtual, pai] = pilha.pop();
        const estadoString = estadoAtual.join(',');

        // Verificar se o estado já foi visitado
        if (visitados.has(estadoString)) {
            continue;
        }

        // Marcar o estado como visitado
        visitados.add(estadoString);

        // Adicionar o nó à árvore
        arvore.push({ estado: estadoAtual, pai, transicao: caminhoAtual[caminhoAtual.length - 1] });

        // Verificar se o objetivo foi alcançado
        if (estadoAtual[0] === objetivo[0] && estadoAtual[1] === objetivo[1] && estadoAtual[2] === objetivo[2]) {
            return arvore; // Retorna a árvore gerada
        }

        // Possíveis transferências
        const transferencias = [
            ["A -> B", () => {
                const [novoA, novoB] = transferir(estadoAtual[0], estadoAtual[1], CAPACIDADE_B);
                return [novoA, novoB, estadoAtual[2]];
            }],
            ["A -> C", () => {
                const [novoA, novoC] = transferir(estadoAtual[0], estadoAtual[2], CAPACIDADE_C);
                return [novoA, estadoAtual[1], novoC];
            }],
            ["B -> A", () => {
                const [novoB, novoA] = transferir(estadoAtual[1], estadoAtual[0], CAPACIDADE_A);
                return [novoA, novoB, estadoAtual[2]];
            }],
            ["B -> C", () => {
                const [novoB, novoC] = transferir(estadoAtual[1], estadoAtual[2], CAPACIDADE_C);
                return [estadoAtual[0], novoB, novoC];
            }],
            ["C -> A", () => {
                const [novoC, novoA] = transferir(estadoAtual[2], estadoAtual[0], CAPACIDADE_A);
                return [novoA, estadoAtual[1], novoC];
            }],
            ["C -> B", () => {
                const [novoC, novoB] = transferir(estadoAtual[2], estadoAtual[1], CAPACIDADE_B);
                return [estadoAtual[0], novoB, novoC];
            }]
        ];

        // Adicionar os novos estados gerados na pilha
        for (const [nome, transferencia] of transferencias) {
            const novoEstado = transferencia();
            const novoEstadoString = novoEstado.join(',');

            if (!visitados.has(novoEstadoString)) {
                pilha.push([novoEstado, [...caminhoAtual, nome], estadoString]); // Inclui o estado atual como pai
            }
        }
    }

    return arvore; // Retorna a árvore gerada, mesmo que o objetivo não seja alcançado
}