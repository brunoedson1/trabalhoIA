// busca_a_estrela.js
import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';
import { PriorityQueue } from '@datastructures-js/priority-queue';

// Função para transferir água de um recipiente para outro
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Heurística: Soma das diferenças entre o estado atual e o objetivo
function heuristica(estado) {
    return Math.abs(estado[0] - objetivo[0]) + Math.abs(estado[1] - objetivo[1]) + Math.abs(estado[2] - objetivo[2]);
}

// Busca A*
export function buscaAEstrela() {
    const filaPrioridade = new PriorityQueue((a, b) => b[0] - a[0]); // Menor custo total primeiro
    const visitados = new Set();
    filaPrioridade.enqueue([heuristica(estadoInicial), estadoInicial, [], 0]); // [custoTotal, estado, caminho, custoReal]

    while (!filaPrioridade.isEmpty()) {
        const [_, estadoAtual, caminhoAtual, custoRealAtual] = filaPrioridade.dequeue();
        const estadoString = estadoAtual.join(',');

        if (visitados.has(estadoString)) {
            continue;
        }

        visitados.add(estadoString);

        if (estadoAtual[0] === objetivo[0] && estadoAtual[1] === objetivo[1] && estadoAtual[2] === objetivo[2]) {
            console.log("\n=== Resultado ===");
            console.log("Objetivo alcançado!");
            console.log("Caminho seguido (passo a passo):\n");
            caminhoAtual.forEach((passo, index) => {
                console.log(`${index + 1}. ${passo}`);
            });
            console.log("\nEstado final alcançado: ", estadoAtual);
            return;
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
                filaPrioridade.enqueue([novoCustoTotal, novoEstado, [...caminhoAtual, `${nome}: ${estadoAtual.join(' -> ')} -> ${novoEstado.join(',')}`], novoCustoReal]);
            }
        }
    }

    console.log("\n=== Resultado ===");
    console.log("Falha em alcançar o objetivo.");
}

// Teste da Busca A*
console.log("\n=== Testando Busca A* ===");
buscaAEstrela();