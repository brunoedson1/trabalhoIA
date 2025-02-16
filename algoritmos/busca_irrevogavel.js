import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca Irrevogável usando DFS
export function buscaIrrevogavel() {
    // Conjunto para rastrear estados visitados
    const visitados = new Set();
    const arvore = [];

    // Função recursiva para a busca
    function dfs(estado, caminho, pai) {
        const estadoString = estado.join(',');

        // Verificar se o estado já foi visitado
        if (visitados.has(estadoString)) {
            return false;
        }

        // Marcar estado como visitado
        visitados.add(estadoString);

        // Adicionar o nó à árvore
        arvore.push({ estado, pai, transicao: caminho[caminho.length - 1] });

        // Verificar se o objetivo foi alcançado
        if (estado[0] === objetivo[0] && estado[1] === objetivo[1] && estado[2] === objetivo[2]) {
            return true; // Objetivo alcançado
        }

        // Possíveis transferências
        const transferencias = [
            ["A -> B", () => {
                const [novoA, novoB] = transferir(estado[0], estado[1], CAPACIDADE_B);
                return [novoA, novoB, estado[2]];
            }],
            ["A -> C", () => {
                const [novoA, novoC] = transferir(estado[0], estado[2], CAPACIDADE_C);
                return [novoA, estado[1], novoC];
            }],
            ["B -> A", () => {
                const [novoB, novoA] = transferir(estado[1], estado[0], CAPACIDADE_A);
                return [novoA, novoB, estado[2]];
            }],
            ["B -> C", () => {
                const [novoB, novoC] = transferir(estado[1], estado[2], CAPACIDADE_C);
                return [estado[0], novoB, novoC];
            }],
            ["C -> A", () => {
                const [novoC, novoA] = transferir(estado[2], estado[0], CAPACIDADE_A);
                return [novoA, estado[1], novoC];
            }],
            ["C -> B", () => {
                const [novoC, novoB] = transferir(estado[2], estado[1], CAPACIDADE_B);
                return [estado[0], novoB, novoC];
            }]
        ];

        // Explorar todas as transferências possíveis
        for (const [nome, transferencia] of transferencias) {
            const novoEstado = transferencia();
            if (dfs(novoEstado, [...caminho, nome], estadoString)) {
                return true; // Encerra a busca se o objetivo for alcançado
            }
        }

        return false; // Continua a busca
    }

    // Iniciar busca a partir do estado inicial
    if (!dfs(estadoInicial, [], null)) {
        console.log("Falha em alcançar o objetivo.");
    }

    return arvore; // Retorna a árvore gerada
}