# Documentacao detalhada do projeto

## 1. Visao geral
Este projeto e um editor 3D de cenario feito com Three.js, com:

- terreno procedural
- insercao de multiplos modelos 3D low-poly
- drag and drop de objetos sobre o terreno
- exportacao/importacao do cenario em JSON
- exportacao da cena para GLTF
- modo de controlo em primeira pessoa no modelo humano
- sistema de sombras dinamicas

O ponto de entrada principal e `index.html`, que importa os modulos de modelos (`dino.js`, `tree.js`, etc.) e gere toda a interacao.

## 2. Estrutura de ficheiros

- `index.html`: inicializacao da cena, UI, controlos, drag/drop, export/import, camera, sombras, animacao.
- `terrain.js`: criacao do terreno procedural (vale central + montanhas nas bordas).
- `dino.js`: construcao do dinossauro (grupo de varias malhas) e objetos expostos para animacao.
- `tree.js`: arvore procedural com tronco, raizes, ramos extrudidos e copas em estrela.
- `grass.js`: grupo de laminas de erva com variacao aleatoria.
- `bush.js`: arbusto seco com muitos ramos/cilindros orientados radialmente.
- `lrock.js`: pedras low-poly de 3 tamanhos (small, medium, large).
- `tumbleweed.js`: bola rolante (feno) com comportamento fisico simples de vento/salto.
- `human.js`: manequim de madeira articulado, usado tambem no modo primeira pessoa.
- `cenario_floresta.json`: exemplo de cenario exportado.

## 3. Fluxo principal em `index.html`

### 3.1 Inicializacao (`init`)
Dentro de `init()` acontece:

1. Criacao da cena e do terreno.
2. Configuracao de camera perspective.
3. Configuracao de luz direcional (sol), luz ambiente e sombras.
4. Criacao do renderer WebGL.
5. Configuracao dos eventos de rato e teclado.
6. Configuracao de OrbitControls.
7. Inicio do loop de animacao (`animate()`).

### 3.2 Estado global da cena
O projeto guarda referencias para os objetos inseridos em arrays:

- `trees`, `grasses`, `bushes`, `rocks`, `tumbleweeds`, `humans`
- o dino e guardado em `dinoData` (objeto especial com `model` e `parts`)

Isto permite:

- apagar objetos corretamente
- serializar para JSON
- aplicar animacao especifica (dino e tumbleweed)

## 4. Funcionalidades implementadas

## 4.1 Insercao de modelos pela sidebar
Cada botao da sidebar chama uma funcao `window.addX()` que:

1. cria o modelo (`createX()`)
2. define posicao inicial
3. ativa sombras (`applyShadowSettings`)
4. adiciona na cena
5. faz snap ao terreno (`snapObjectToTerrain`) quando aplicavel
6. guarda no array correspondente

## 4.2 Drag and drop no terreno
Mecanismo:

1. `mousedown`: raycast para escolher objeto.
2. sobe ao grupo raiz (objeto logico completo).
3. ativa drag com plano horizontal (`dragPlane`).
4. `mousemove`: move em X/Z no plano.
5. `mouseup`: chama `snapObjectToTerrain` para pousar no relevo.

## 4.3 Remocao de objetos
Existem 2 formas:

- modo apagar (`deleteModeButton`): clicar remove
- tecla `Delete`/`Backspace` no ultimo objeto selecionado

A funcao `removeScenarioObject` remove da cena e do array correto.

## 4.4 Persistencia de cenario (JSON)

- Export JSON: botao `downloadSceneJsonButton` gera `cenario.json`.
- Import JSON: botao `loadSceneJsonButton` abre ficheiro e reconstrui a cena.

Schema usado:

```json
{
  "version": 1,
  "terrainColor": "#55aa55",
  "objects": [
    {
      "type": "tree",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    }
  ]
}
```

Notas:

- `rock` guarda tambem `rockSize`.
- `dino` e unico (ha logica para nao duplicar sem limpar).

## 4.5 Exportacao GLTF
Botao `Exportar GLTF` (e atalho `E`) usa `GLTFExporter` para exportar a cena atual.

## 4.6 Modo primeira pessoa no humano
Implementado em `index.html`:

- entrar/sair por botao ou tecla `F`
- sair com `Esc`
- esconder sidebar ao entrar
- movimento com `WASD`
- salto com `Space`
- gravidade simples
- camera orientada por rato (pointer lock)
- camera posicionada na altura dos olhos com offset frontal
- OrbitControls desativados neste modo

## 4.7 Sombras e iluminacao

- `DirectionalLight` com `castShadow = true`
- `PCFSoftShadowMap`
- foco da sombra atualizado por frame (`updateSunShadowFocus`)
  - segue `controls.target` no modo normal
  - segue o humano no modo primeira pessoa

Isto reduz cortes/desaparecimento de sombras quando a zona ativa muda.

## 4.8 Animacoes ativas

### Dino
No loop `animate()`:

- respiracao (escala e offset de tronco/pescoco)
- movimento de cabeca/mandibula
- movimento da cauda por segmentos
- ciclo de pernas ligado a `movementSpeed`

### Tumbleweed
No loop `animate()`:

- rolagem sobre eixo aleatorio
- deslocamento por vento (`userData.wind`)
- saltos ocasionais com gravidade
- correcao para manter acima do terreno

## 5. Como cada modelo e feito

## 5.1 Terreno (`terrain.js`)
Tecnica:

- `PlaneGeometry(3000, 3000, 100, 100)`
- rotacao para horizontal (`rotateX(-PI/2)`)
- deslocacao de vertices em Y com funcao radial + seno/cosseno

Comportamento:

- vale central quase plano (`valleyRadius`)
- montanhas crescentes para as bordas (`maxElevation`)
- normais recomputadas para iluminacao suave

## 5.2 Dinossauro (`dino.js`)
Tecnica:

- 1 grupo principal `dino`
- subgrupos para partes animaveis (`grupoCabecaSuperior`, `grupoMandibula`, `grupopernaa`, `grupopernab`)
- corpo montado com muitas primitivas (`BoxGeometry`, `ConeGeometry`, `SphereGeometry`)
- texturas para pele/osso/pelo via `TextureLoader`

Estrutura importante:

- retorna `{ model, parts }`
- `parts` expoe referencias para animacao no `index.html`
- define `dino.name = 'Dino'` e `dino.userData.groundOffset`

## 5.3 Arvore (`tree.js`)
Tecnica:

- tronco em caixa
- sistema de raizes com varias caixas
- ramos com `ExtrudeGeometry` a partir de `Shape` personalizada
- copa principal em estrelas extrudidas por camadas
- mini-copas nos ramos
- variacao aleatoria de escala, orientacao e tons verdes

Resultado:

- cada arvore fica procedural e diferente das outras

## 5.4 Erva (`grass.js`)
Tecnica:

- grupo com varias laminas (`CylinderGeometry` estreita)
- distribuicao radial aleatoria
- inclinacao e rotacao aleatorias
- variacao de altura/largura/tom verde

## 5.5 Arbusto seco (`bush.js`)
Tecnica:

- muitos ramos curtos (`CylinderGeometry`)
- distribuicao em hemisferio superior
- orientacao radial com tendencia para cima
- base alinhada a `y=0` por bounding box

## 5.6 Pedra (`lrock.js`)
Tecnica:

- blocos low-poly com `IcosahedronGeometry`
- 1, 2 ou 3 chunks por tamanho (`small`, `medium`, `large`)
- cada chunk com offset e escala proprios
- escala final por tamanho

## 5.7 Tumbleweed (`tumbleweed.js`)
Tecnica geometrica:

- anel de torus pequenos (fibras)
- galhos cilindricos orientados radialmente
- base alinhada por bounding box

Comportamento:

- dados em `userData`: eixo de rolagem, velocidade, vento, salto, gravidade, offset do chao
- animacao no `index.html` usa estes parametros para movimento autonomo

## 5.8 Humano manequim (`human.js`)
Tecnica:

- montagem por segmentos com juntas (esferas + cilindros)
- cabeca, tronco, pelvis, bracos, pernas, pes
- estilo de manequim de madeira

Integracao com gameplay:

- `name = 'Human'`
- `userData.groundOffset`
- usado no modo primeira pessoa

## 6. Gestao de posicionamento no terreno
A funcao `snapObjectToTerrain` faz raycast vertical para o terreno e aplica `clearance` por tipo de objeto (`getPlacementClearance`).

Objetivo:

- evitar objetos enterrados
- evitar objetos a flutuar
- permitir ajuste fino por tipo (dino, humano, tumbleweed)

## 7. O que ja esta implementado

- editor de cenario com sidebar
- criacao de 6 tipos de modelos (mais 3 tamanhos de pedra)
- drag and drop de objetos
- modo apagar + apagar por teclado
- export GLTF da cena
- export/import JSON do cenario
- animacao do dino
- movimento autonomo do tumbleweed
- modo primeira pessoa no humano com WASD + salto
- esconder sidebar no modo humano e restaurar ao sair
- sombras dinamicas com foco adaptativo

## 8. Melhorias futuras

- menu de configuracao (velocidade do humano, altura salto, sensibilidade)
- presets de luz/sombra (qualidade baixa/media/alta)
- modo dia/tarde/noite
- botao "limpar cenario"
- undo/redo de operacoes
- transformacoes (rodar/escalar)
- separacao de logica de input em modulo proprio
- mais modelos de outros animais
- mais animações
- animações do ser humano e interações com outros objetos no meio 
- secao de configuracao unica para manutencao
- colocar colisões com os objetos

## Deploy em: https://lucasruivo.github.io/ICG_project/index.html
