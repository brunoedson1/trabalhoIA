const { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } = require('./config.js');

const PriorityQueue = require('priorityqueuejs');

function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca Ordenada (Uniforme)
function buscaOrdenada() {
    const filaPrioridade = new PriorityQueue((a, b) => b[2] - a[2]); // Menor custo primeiro
    const visitados = new Set();

    filaPrioridade.enq([estadoInicial, [], 0]);

    while (!filaPrioridade.isEmpty()) {
        const [estadoAtual, caminhoAtual, custoAtual] = filaPrioridade.deq();
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
            const novoCusto = custoAtual + 1; // Custo uniforme

            if (!visitados.has(novoEstadoString)) {
                filaPrioridade.enq([novoEstado, [...caminhoAtual, `${nome}: ${estadoAtual.join(' -> ')} -> ${novoEstado.join(',')}`], novoCusto]);
            }
        }
    }

    console.log("\n=== Resultado ===");
    console.log("Falha em alcançar o objetivo.");
}

// Teste da Busca Ordenada
console.log("\n=== Testando Busca Ordenada ===");
buscaOrdenada();
