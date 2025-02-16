import { buscaAEstrela } from '../../algoritmos/busca_a_estrela.js';
import { buscaBacktracking } from '../../algoritmos/busca_backtracking.js';
import { buscaGulosa } from '../../algoritmos/busca_gulosa.js';
import { buscaIrrevogavel } from '../../algoritmos/busca_irrevogavel.js';
import { buscaLargura } from '../../algoritmos/busca_largura.js';
import { buscaOrdenada } from '../../algoritmos/busca_ordenada.js';
import { buscaProfundidade } from '../../algoritmos/busca_profundidade.js';

function renderizarArvore(arvore) {
    console.log("Árvore recebida para renderização:", arvore);

    const width = 1200;
    const height = 800;

    const svg = d3.select("#arvore")
        .html("") // Limpa o conteúdo anterior
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 50)");

    // Criar um mapa de nós
    const nos = {};
    arvore.forEach(({ estado, pai, transicao }) => {
        const estadoString = estado.join(',');
        nos[estadoString] = { estado, transicao, children: [] };
    });

    // Vincular nós pais e filhos
    arvore.forEach(({ estado, pai }) => {
        const estadoString = estado.join(',');
        if (pai) {
            nos[pai].children.push(nos[estadoString]);
        }
    });

    // Encontrar a raiz da árvore
    const raiz = arvore.find(({ pai }) => pai === null);
    if (!raiz) return;

    // Criar a hierarquia da árvore
    const root = d3.hierarchy(nos[raiz.estado.join(',')]);
    const treeLayout = d3.tree().size([width - 100, height - 100]); // Ajuste o tamanho da árvore
    treeLayout(root);

    // Desenhar links
    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    // Desenhar nós
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("y", d => d.children ? -15 : 15)
        .style("text-anchor", "middle")
        .text(d => `[${d.data.estado.join(', ')}]`);
}

// Evento de clique no botão
document.getElementById('executar-busca').addEventListener('click', () => {
    const algoritmoSelecionado = document.getElementById('algoritmo').value;

    const funcoesBusca = {
        buscaAEstrela,
        buscaBacktracking,
        buscaGulosa,
        buscaIrrevogavel,
        buscaLargura,
        buscaOrdenada,
        buscaProfundidade
    };

    const funcaoBusca = funcoesBusca[algoritmoSelecionado];
    if (!funcaoBusca) {
        console.error("Algoritmo de busca inválido.");
        return;
    }

    const arvore = funcaoBusca();
    console.log("Árvore gerada:", arvore); // Verifique a saída no console

    if (!Array.isArray(arvore)) {
        console.error("Erro: A função de busca não retornou uma árvore válida.");
        return;
    }

    renderizarArvore(arvore);
});