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
    const abertosLog = [];
    const fechadosLog = [];

    filaPrioridade.enqueue([heuristica(estadoInicial), estadoInicial, [], null, 0]);

    while (!filaPrioridade.isEmpty()) {
        const [_, estadoAtual, caminhoAtual, pai, custoRealAtual] = filaPrioridade.dequeue();
        const estadoString = estadoAtual.join(',');

        if (visitados.has(estadoString)){
            continue;
        }
        visitados.add(estadoString);

        // Logs
        fechadosLog.push(estadoAtual);

        arvore.push({ estado: estadoAtual, pai, transicao: caminhoAtual[caminhoAtual.length - 1] });

        if (estadoAtual[0] === objetivo[0] && estadoAtual[1] === objetivo[1] && estadoAtual[2] === objetivo[2]) {
            return { arvore, abertosLog, fechadosLog };
        }

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

        for (const [nome, transferencia] of transferencias) {
            const novoEstado = transferencia();
            const novoEstadoString = novoEstado.join(',');
            const novoCustoReal = custoRealAtual + 1;
            const novoCustoTotal = novoCustoReal + heuristica(novoEstado);

            if (!visitados.has(novoEstadoString)) {
                filaPrioridade.enqueue([novoCustoTotal, novoEstado, [...caminhoAtual, nome], estadoString, novoCustoReal]);
                abertosLog.push(novoEstado); // Agora só adiciona os estados que entraram na fila
            }
        }
    }

    return { arvore, abertosLog, fechadosLog };
}