import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';
import { PriorityQueue } from '@datastructures-js/priority-queue';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca Ordenada (Uniforme)
export function buscaOrdenada() {
    // Fila de prioridade para armazenar os estados a serem explorados
    const filaPrioridade = new PriorityQueue((a, b) => b[2] - a[2]); // Menor custo primeiro
    const visitados = new Set();
    const arvore = [];

    // Inicializa a fila com o estado inicial
    filaPrioridade.enqueue([estadoInicial, [], null, 0]); // [estadoAtual, caminhoAtual, pai, custoAtual]

    // Enquanto houver estados na fila
    while (!filaPrioridade.isEmpty()) {
        // Retirar o estado com menor custo da fila
        const [estadoAtual, caminhoAtual, pai, custoAtual] = filaPrioridade.dequeue();
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
            const novoCusto = custoAtual + 1; // Custo uniforme

            if (!visitados.has(novoEstadoString)) {
                filaPrioridade.enqueue([novoEstado, [...caminhoAtual, nome], estadoString, novoCusto]);
            }
        }
    }

    return arvore; // Retorna a árvore gerada, mesmo que o objetivo não seja alcançado
}