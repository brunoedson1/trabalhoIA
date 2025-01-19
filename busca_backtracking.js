
const CAPACIDADE_A = 8;
const CAPACIDADE_B = 5;
const CAPACIDADE_C = 3;

const estadoInicial = [8, 0, 0];
const objetivo = [4, 4, 0];

// Função para transferir água de um recipiente para outro
function transferir(origem, destino, capacidadeDestino) {
    const transferirQuantidade = Math.min(origem, capacidadeDestino - destino);
    return [origem - transferirQuantidade, destino + transferirQuantidade];
}

// Busca com backtracking
function buscaBacktracking() {
    // Conjunto para rastrear estados visitados
    const visitados = new Set();

    // Caminho final
    const caminhoFinal = [];

    // Função recursiva para a busca
    function backtrack(estado, caminho) {
        const estadoString = estado.join(',');

        // Verificar se o estado já foi visitado
        if (visitados.has(estadoString)) {
            return false;
        }

        visitados.add(estadoString);

    
        caminho.push(estadoString);

        console.log(`Caminho: ${caminho.join(' -> ')}`);

        // Verificar se o objetivo foi alcançado
        if (estado[0] === objetivo[0] && estado[1] === objetivo[1] && estado[2] === objetivo[2]) {
            caminhoFinal.push(...caminho);
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
            if (backtrack(novoEstado, [...caminho, nome])) {
                return true;
            }
        }

        // Retroceder se o objetivo não foi alcançado
        caminho.pop();
        return false;
    }

    // Iniciar busca a partir do estado inicial
    if (backtrack(estadoInicial, [])) {
        console.log("\nObjetivo alcançado! Caminho encontrado:");
        console.log(caminhoFinal.join(' -> '));
    } else {
        console.log("\nFalha em alcançar o objetivo.");
    }
}


console.log("\n=== Testando Busca com Backtracking ===");
buscaBacktracking();
