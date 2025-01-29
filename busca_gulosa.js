const { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } = require('./config.js');

const PriorityQueue = require('priorityqueuejs');

function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Heurística: Soma das diferenças entre o estado atual e o objetivo
function heuristica(estado) {
    return Math.abs(estado[0] - objetivo[0]) + Math.abs(estado[1] - objetivo[1]) + Math.abs(estado[2] - objetivo[2]);
}

// Busca Gulosa
function buscaGulosa() {
    const filaPrioridade = new PriorityQueue((a, b) => b[1] - a[1]); // Menor heurística primeiro
    const visitados = new Set();

    filaPrioridade.enq([estadoInicial, heuristica(estadoInicial), []]);

    while (!filaPrioridade.isEmpty()) {
        const [estadoAtual, _, caminhoAtual] = filaPrioridade.deq();
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
            const heuristicaValor = heuristica(novoEstado);

            if (!visitados.has(novoEstadoString)) {
                filaPrioridade.enq([novoEstado, heuristicaValor, [...caminhoAtual, `${nome}: ${estadoAtual.join(' -> ')} -> ${novoEstado.join(',')}`]]);
            }
        }
    }

    console.log("\n=== Resultado ===");
    console.log("Falha em alcançar o objetivo.");
}

// Teste da Busca Gulosa
console.log("\n=== Testando Busca Gulosa ===");
buscaGulosa();
