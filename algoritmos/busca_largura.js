import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca em Largura (BFS)
export function buscaLargura() {
    // Fila para armazenar os estados a serem explorados
    const fila = [[estadoInicial, [], null]]; // [estadoAtual, caminhoAtual, pai]
    const arvore = [];
    // Conjunto para rastrear estados visitados
    const visitados = new Set();

    // Enquanto houver estados na fila
    while (fila.length > 0) {
        // Retirar o primeiro estado da fila
        const [estadoAtual, caminhoAtual, pai] = fila.shift();
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

        // Adicionar os novos estados gerados na fila
        for (const [nome, transferencia] of transferencias) {
            const novoEstado = transferencia();
            const novoEstadoString = novoEstado.join(',');
            if (!visitados.has(novoEstadoString)) {
                fila.push([novoEstado, [...caminhoAtual, nome], estadoString]); // Inclui o estado atual como pai
            }
        }
    }

    return arvore; // Retorna a árvore gerada, mesmo que o objetivo não seja alcançado
}