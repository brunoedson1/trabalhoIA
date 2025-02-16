// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crie a instância do aplicativo Express
const app = express();

// Importe seus algoritmos
import { buscaAEstrela } from './algoritmos/busca_a_estrela.js';
import { buscaBacktracking } from './algoritmos/busca_backtracking.js';
import { buscaGulosa } from './algoritmos/busca_gulosa.js';
import { buscaIrrevogavel } from './algoritmos/busca_irrevogavel.js';
import { buscaLargura } from './algoritmos/busca_largura.js';
import { buscaOrdenada } from './algoritmos/busca_ordenada.js';
import { buscaProfundidade } from './algoritmos/busca_profundidade.js';
import * as config from './config.js';


// Defina a pasta pública
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/busca/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    let resultado;

    switch (tipo) {
        case 'aestrela':
            resultado = buscaAEstrela(config);
            break;
        case 'backtracking':
            resultado = buscaBacktracking(config);
            break;
        case 'gulosa':
            resultado = buscaGulosa(config);
            break;
        case 'irrevogavel':
            resultado = buscaIrrevogavel(config);
            break;
        case 'largura':
            resultado = buscaLargura(config);
            break;
        case 'ordenada':
            resultado = buscaOrdenada(config);
            break;
        case 'profundidade':
            resultado = buscaProfundidade(config);
            break;
        default:
            return res.status(404).json({ error: 'Tipo de busca não encontrado' });
    }

    res.json(resultado);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
