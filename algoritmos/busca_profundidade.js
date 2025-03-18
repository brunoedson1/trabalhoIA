import { CAPACIDADE_A, CAPACIDADE_B, CAPACIDADE_C, PESO_A, PESO_B, PESO_C, estadoInicial, objetivo } from '../config.js';

// Função de transferência
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca em Profundidade (DFS)
export function buscaProfundidade() {
    const pilha = [[estadoInicial, [], null, 0]]; // [estadoAtual, caminhoAtual, pai, custoTotal]
    const visitados = new Set();
    const arvore = [];
    const caminhos = [];
    const abertosLog = [];
    const fechadosLog = [];

    while (pilha.length > 0) {
        const [estadoAtual, caminhoAtual, pai, custoTotal] = pilha.pop();
        const estadoString = estadoAtual.join(',');

        if (visitados.has(estadoString)) continue;
        visitados.add(estadoString);

        // Logs
        fechadosLog.push(estadoAtual);

        arvore.push({ estado: estadoAtual, pai, transicao: caminhoAtual.length > 0 ? caminhoAtual[caminhoAtual.length - 1] : null, custo: custoTotal });

        if (estadoAtual[0] === objetivo[0] && estadoAtual[1] === objetivo[1] && estadoAtual[2] === objetivo[2]) {
            caminhos.push({ caminho: [...caminhoAtual], custo: custoTotal }); // Armazenar o caminho encontrado
            continue; // Continuar a busca para encontrar mais caminhos
        }

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

            if (!visitados.has(novoEstadoString)) {
                pilha.push([novoEstado, [...caminhoAtual, nome], estadoString, custoTotal + peso]);
                abertosLog.push(novoEstado);
            }
        }
    }

    if (caminhos.length === 0) {
        console.log("Falha em alcançar o objetivo.");
    }

    return { arvore, caminhos, abertosLog, fechadosLog }; // Retorna a árvore gerada e todos os caminhos encontrados
}