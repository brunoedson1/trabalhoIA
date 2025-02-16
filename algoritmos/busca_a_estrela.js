import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';
import { PriorityQueue } from 'https://cdn.skypack.dev/@datastructures-js/priority-queue';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Heurística: Soma das diferenças entre o estado atual e o objetivo
function heuristica(estado) {
    return Math.abs(estado[0] - objetivo[0]) +
           Math.abs(estado[1] - objetivo[1]) +
           Math.abs(estado[2] - objetivo[2]);
}

// Busca A*
export function buscaAEstrela() {
    const filaPrioridade = new PriorityQueue((a, b) => b[0] - a[0]); // Menor custo total primeiro
    const visitados = new Set();
    const arvore = [];

    // Inicializa a fila com o estado inicial
    filaPrioridade.enqueue([heuristica(estadoInicial), estadoInicial, [], null, 0]); 
    // [custoTotal, estadoAtual, caminhoAtual, pai, custoReal]

    while (!filaPrioridade.isEmpty()) {
        const [_, estadoAtual, caminhoAtual, pai, custoRealAtual] = filaPrioridade.dequeue();
        const estadoString = estadoAtual.join(',');

        // Verifica se o estado já foi visitado
        if (visitados.has(estadoString)) {
            continue;
        }

        // Marca o estado como visitado
        visitados.add(estadoString);

        // Adiciona o nó à árvore
        arvore.push({ estado: estadoAtual, pai, transicao: caminhoAtual[caminhoAtual.length - 1] });

        // Verifica se o objetivo foi alcançado
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

        // Explora todas as transferências possíveis
        for (const [nome, transferencia] of transferencias) {
            const novoEstado = transferencia();
            const novoEstadoString = novoEstado.join(',');
            const novoCustoReal = custoRealAtual + 1;
            const novoCustoTotal = novoCustoReal + heuristica(novoEstado);

            if (!visitados.has(novoEstadoString)) {
                filaPrioridade.enqueue([
                    novoCustoTotal,
                    novoEstado,
                    [...caminhoAtual, `${nome}: ${estadoAtual.join(' -> ')} -> ${novoEstado.join(',')}`],
                    estadoString, // O estado atual é o pai do novo estado
                    novoCustoReal
                ]);
            }
        }
    }

    return arvore; // Retorna a árvore gerada, mesmo que o objetivo não seja alcançado
}