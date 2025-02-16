import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, estadoInicial, objetivo } from '../config.js';

// Função para transferir água de um recipiente para outro
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca irrevogável usando DFS
export function buscaIrrevogavel() {
    // Conjunto para rastrear estados visitados
    const visitados = new Set();
    const tree = [];

    // Função recursiva para a busca
    function dfs(estado, caminho) {
        const estadoString = estado.join(',');

        // Verificar se o estado já foi visitado
        if (visitados.has(estadoString)) {
            return false;
        }

        // Marcar estado como visitado
        visitados.add(estadoString);

        // Exibir caminho e estado atual
        console.log(`Caminho: ${caminho.join(' -> ')} | Estado: [${estado}]`);
        tree.push({ caminho, estado });

        // Verificar se o objetivo foi alcançado
        if (estado[0] === objetivo[0] && estado[1] === objetivo[1] && estado[2] === objetivo[2]) {
            console.log("Objetivo alcançado!");
            return true;
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
            if (dfs(novoEstado, [...caminho, nome])) {
                return true;
            }
        }

        return false;
    }

    // Iniciar busca a partir do estado inicial
    if (!dfs(estadoInicial, [])) {
        console.log("Falha em alcançar o objetivo.");
        return tree;
    } else {
        console.log("Falha em alcançar o objetivo.");
        return null;
    }
}

// Teste da Busca Irrevogável
console.log("\n=== Testando Busca Irrevogável ===");
buscaIrrevogavel();
