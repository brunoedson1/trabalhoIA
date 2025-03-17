import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, PESO_A, PESO_B, PESO_C, estadoInicial, objetivo } from '../config.js';
import { PriorityQueue } from 'https://cdn.skypack.dev/@datastructures-js/priority-queue';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Heurística baseada na soma das diferenças
function heuristica(estado) {
    return Math.abs(estado[0] - objetivo[0]) +
           Math.abs(estado[1] - objetivo[1]) +
           Math.abs(estado[2] - objetivo[2]);
}

// Busca A* considerando pesos
export function buscaAEstrela() {
    const filaPrioridade = new PriorityQueue((a, b) => b[0] - a[0]); // Menor custo primeiro
    const custosVisitados = new Map(); // Estado -> menor custo real
    const visitados = new Set(); // Conjunto para rastrear estados visitados
    const arvore = [];
    const caminhos = [];
    const abertosLog = [];
    const fechadosLog = [];
    let objetivoAlcancado = false;

    filaPrioridade.enqueue([heuristica(estadoInicial), estadoInicial, [], null, 0]);
    custosVisitados.set(estadoInicial.join(','), 0);

    while (!filaPrioridade.isEmpty()) {
        const [_, estadoAtual, caminhoAtual, pai, custoRealAtual] = filaPrioridade.dequeue();
        const estadoString = estadoAtual.join(',');

        if (visitados.has(estadoString)) continue;
        visitados.add(estadoString);

        fechadosLog.push(estadoAtual);

        arvore.push({
            estado: estadoAtual,
            pai,
            transicao: caminhoAtual.length > 0 ? caminhoAtual[caminhoAtual.length - 1] : null,
            custo: custoRealAtual
        });

        if (estadoAtual[0] === objetivo[0] && estadoAtual[1] === objetivo[1] && estadoAtual[2] === objetivo[2]) {
            if (!objetivoAlcancado) {
                caminhos.push({ caminho: [...caminhoAtual], custo: custoRealAtual }); // Armazenar o caminho encontrado
                objetivoAlcancado = true;
            }
            continue; // Continuar a busca para encontrar mais caminhos
        }

        // Lista de transferências possíveis com pesos aplicados
        const transferencias = [
            ["A -> B", PESO_A, () => {
                const [novoA, novoB] = transferir(estadoAtual[0], estadoAtual[1], CAPACIDADE_B);
                return [novoA, novoB, estadoAtual[2]];
            }],
            ["A -> C", PESO_A, () => {
                const [novoA, novoC] = transferir(estadoAtual[0], estadoAtual[2], CAPACIDADE_C);
                return [novoA, estadoAtual[1], novoC];
            }],
            ["B -> A", PESO_B, () => {
                const [novoB, novoA] = transferir(estadoAtual[1], estadoAtual[0], CAPACIDADE_A);
                return [novoA, novoB, estadoAtual[2]];
            }],
            ["B -> C", PESO_B, () => {
                const [novoB, novoC] = transferir(estadoAtual[1], estadoAtual[2], CAPACIDADE_C);
                return [estadoAtual[0], novoB, novoC];
            }],
            ["C -> A", PESO_C, () => {
                const [novoC, novoA] = transferir(estadoAtual[2], estadoAtual[0], CAPACIDADE_A);
                return [novoA, estadoAtual[1], novoC];
            }],
            ["C -> B", PESO_C, () => {
                const [novoC, novoB] = transferir(estadoAtual[2], estadoAtual[1], CAPACIDADE_B);
                return [estadoAtual[0], novoB, novoC];
            }]
        ];

        for (const [nome, peso, transferencia] of transferencias) {
            const novoEstado = transferencia();
            const novoEstadoString = novoEstado.join(',');
            const novoCustoReal = custoRealAtual + peso; // Adiciona peso ao custo real
            const novoCustoTotal = novoCustoReal + heuristica(novoEstado);

            if (!custosVisitados.has(novoEstadoString) || novoCustoReal < custosVisitados.get(novoEstadoString)) {
                custosVisitados.set(novoEstadoString, novoCustoReal);
                filaPrioridade.enqueue([novoCustoTotal, novoEstado, [...caminhoAtual, nome], estadoString, novoCustoReal]);
                abertosLog.push(novoEstado);
            }
        }
    }

    return { arvore, caminhos, abertosLog, fechadosLog };
}