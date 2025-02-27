import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca em Profundidade (DFS)
export function buscaProfundidade() {
    const pilha = [[estadoInicial, [], null]]; // [estadoAtual, caminhoAtual, pai]
    const visitados = new Set();
    const arvore = [];
    const abertosLog = [];
    const fechadosLog = [];

    while (pilha.length > 0) {
        const [estadoAtual, caminhoAtual, pai] = pilha.pop();
        const estadoString = estadoAtual.join(',');

        if (visitados.has(estadoString)) continue;
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

            if (!visitados.has(novoEstadoString)) {
                pilha.push([novoEstado, [...caminhoAtual, nome], estadoString]);
                abertosLog.push(novoEstado);
            }
        }
    }

    return { arvore, abertosLog, fechadosLog };
}