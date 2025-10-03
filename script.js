// ===================================
// N8N Academy - Interactive JavaScript
// ===================================

// === GLOBAL STATE ===
let workflowNodes = [];
let workflowConnections = [];
let selectedNode = null;
let canvas, ctx;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initCanvas();
    initDragAndDrop();
    initProgressTracking();
    initAOS();
    initNodeTypeHighlight();
});

// === NAVIGATION ===
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scroll and close menu on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll to section helper
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // navbar height
        const targetPosition = section.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

function initAOS() {
    // Simple AOS implementation
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, entry.target.dataset.aosDelay || 0);
            }
        });
    }, { threshold: 0.1 });

    aosElements.forEach(el => aosObserver.observe(el));
}

// === MODAL FUNCTIONALITY ===
function openModal(content) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');

    const modalContent = {
        'workflows': {
            title: 'Workflows no N8N',
            content: `
                <h2><i class="fas fa-stream"></i> Workflows</h2>
                <p>Um workflow no N8N é uma sequência visual de operações que automatiza processos do início ao fim.</p>

                <h3>Características principais:</h3>
                <ul>
                    <li><strong>Visual:</strong> Interface drag-and-drop intuitiva</li>
                    <li><strong>Modular:</strong> Construído com blocos reutilizáveis</li>
                    <li><strong>Executável:</strong> Pode rodar manualmente ou por triggers</li>
                    <li><strong>Versionável:</strong> Exportável como JSON para Git</li>
                </ul>

                <h3>Tipos de Execução:</h3>
                <ul>
                    <li><i class="fas fa-bolt"></i> <strong>Event-driven:</strong> Acionado por triggers externos</li>
                    <li><i class="fas fa-clock"></i> <strong>Scheduled:</strong> Execução em intervalos definidos</li>
                    <li><i class="fas fa-hand-pointer"></i> <strong>Manual:</strong> Executado sob demanda</li>
                </ul>

                <div class="code-example">
                    <pre><code>// Estrutura básica de um workflow
{
  "nodes": [
    { "type": "trigger", "name": "Start" },
    { "type": "action", "name": "Process" },
    { "type": "action", "name": "Output" }
  ],
  "connections": {
    "Start": { "main": [[{ "node": "Process" }]] }
  }
}</code></pre>
                </div>
            `
        },
        'nodes': {
            title: 'Nodes do N8N',
            content: `
                <h2><i class="fas fa-cube"></i> Nodes</h2>
                <p>Nodes são blocos modulares que executam tarefas específicas dentro de um workflow.</p>

                <h3>Categorias de Nodes:</h3>
                <div class="node-categories">
                    <div class="category">
                        <h4><i class="fas fa-bolt"></i> Trigger Nodes</h4>
                        <p>Iniciam o workflow baseado em eventos</p>
                        <ul>
                            <li>Email Trigger</li>
                            <li>Webhook</li>
                            <li>Schedule Trigger</li>
                            <li>Chat Trigger</li>
                        </ul>
                    </div>

                    <div class="category">
                        <h4><i class="fas fa-cog"></i> Action Nodes</h4>
                        <p>Executam operações principais</p>
                        <ul>
                            <li>HTTP Request</li>
                            <li>Database</li>
                            <li>Google Sheets</li>
                            <li>Send Email</li>
                        </ul>
                    </div>

                    <div class="category">
                        <h4><i class="fas fa-brain"></i> AI Nodes</h4>
                        <p>Integram inteligência artificial</p>
                        <ul>
                            <li>AI Agent</li>
                            <li>OpenAI</li>
                            <li>Claude</li>
                            <li>Gemini</li>
                        </ul>
                    </div>
                </div>

                <p class="highlight">💡 Mais de 400 nodes integrados nativamente!</p>
            `
        },
        'dataflow': {
            title: 'Fluxo de Dados',
            content: `
                <h2><i class="fas fa-exchange-alt"></i> Fluxo de Dados no N8N</h2>
                <p>O N8N opera em um modelo de fluxo baseado em itens JSON.</p>

                <h3>Conceitos-chave:</h3>
                <ul>
                    <li><strong>Item:</strong> Unidade básica - objeto JSON</li>
                    <li><strong>Item Array:</strong> Lista de itens processados juntos</li>
                    <li><strong>Item Linking:</strong> Correlação entre itens de diferentes nodes</li>
                    <li><strong>Binary Data:</strong> Arquivos e dados não-JSON</li>
                </ul>

                <h3>Exemplo de Item:</h3>
                <div class="code-example">
                    <pre><code>{
  "json": {
    "id": 123,
    "name": "Alice",
    "email": "alice@example.com",
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "binary": {}
}</code></pre>
                </div>

                <h3>Transformações:</h3>
                <p>Cada node recebe itens, processa e envia para o próximo:</p>
                <ul>
                    <li><i class="fas fa-arrow-right"></i> Input → Process → Output</li>
                    <li><i class="fas fa-filter"></i> Filtragem e mapeamento</li>
                    <li><i class="fas fa-code"></i> Transformação com Code Node</li>
                    <li><i class="fas fa-object-group"></i> Merge e Split de dados</li>
                </ul>
            `
        },
        'connections': {
            title: 'Conexões',
            content: `
                <h2><i class="fas fa-link"></i> Conexões no N8N</h2>
                <p>Conexões definem o fluxo de execução e dados entre nodes.</p>

                <h3>Tipos de Conexões:</h3>
                <ul>
                    <li><strong>Main:</strong> Fluxo principal de dados</li>
                    <li><strong>Error:</strong> Tratamento de erros</li>
                    <li><strong>Multiple Outputs:</strong> Nodes com saídas condicionais (IF)</li>
                </ul>

                <h3>Padrões de Conexão:</h3>
                <div class="connection-patterns">
                    <div class="pattern">
                        <h4>Linear</h4>
                        <p>A → B → C</p>
                        <span>Sequencial simples</span>
                    </div>

                    <div class="pattern">
                        <h4>Branching</h4>
                        <p>A → [B, C, D]</p>
                        <span>Múltiplas ações paralelas</span>
                    </div>

                    <div class="pattern">
                        <h4>Conditional</h4>
                        <p>IF → [True, False]</p>
                        <span>Lógica condicional</span>
                    </div>

                    <div class="pattern">
                        <h4>Loop</h4>
                        <p>A ⟲ B → C</p>
                        <span>Iteração sobre dados</span>
                    </div>
                </div>

                <p class="highlight">💡 Conexões visuais tornam a lógica transparente e debugável!</p>
            `
        }
    };

    if (modalContent[content]) {
        modalBody.innerHTML = modalContent[content].content;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contentModal');
    if (e.target === modal) {
        closeModal();
    }
});

// === NODE TYPE HIGHLIGHTING ===
function initNodeTypeHighlight() {
    const nodeTypes = document.querySelectorAll('.node-type');

    nodeTypes.forEach(type => {
        type.addEventListener('click', () => {
            // Remove active from all
            nodeTypes.forEach(t => t.classList.remove('active'));
            // Add to clicked
            type.classList.add('active');

            // Could add more interactive features here
            setTimeout(() => {
                type.classList.remove('active');
            }, 2000);
        });
    });
}

function highlightNodeType(type) {
    const nodeType = document.querySelector(`.${type}-type`);
    if (nodeType) {
        nodeType.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nodeType.classList.add('active');
        setTimeout(() => {
            nodeType.classList.remove('active');
        }, 2000);
    }
}

// === PROGRESS TRACKING ===
function initProgressTracking() {
    // Simulate progress (in a real app, this would track actual learning)
    const progressBars = document.querySelectorAll('.progress-fill');

    // Load saved progress from localStorage
    progressBars.forEach(bar => {
        const skill = bar.dataset.skill;
        const savedProgress = localStorage.getItem(`skill-${skill}`) || 0;
        updateProgress(skill, savedProgress);
    });

    // Add click handlers to skill cards to increment progress
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            const skillType = card.classList[1].replace('-card', '');
            const currentProgress = parseInt(localStorage.getItem(`skill-${skillType}`) || 0);
            const newProgress = Math.min(currentProgress + 10, 100);
            updateProgress(skillType, newProgress);
            localStorage.setItem(`skill-${skillType}`, newProgress);
        });
    });
}

function updateProgress(skill, value) {
    const progressFill = document.querySelector(`[data-skill="${skill}"]`);
    const progressPercent = progressFill?.parentElement.parentElement.querySelector('.progress-percent');

    if (progressFill) {
        progressFill.style.width = `${value}%`;
    }

    if (progressPercent) {
        progressPercent.textContent = `${value}%`;
    }
}

// === AGENT FLOW ANIMATION ===
function animateAgentFlow(step) {
    const steps = document.querySelectorAll('.flow-step');

    if (step === 'all') {
        // Animate all steps sequentially
        steps.forEach(s => s.classList.remove('active'));

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
            }
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    steps.forEach(s => s.classList.remove('active'));
                }, 1000);
            }
        }, 800);
    } else {
        // Animate single step
        steps.forEach(s => s.classList.remove('active'));
        steps[step - 1].classList.add('active');
        setTimeout(() => {
            steps[step - 1].classList.remove('active');
        }, 1500);
    }
}

// === CANVAS WORKFLOW BUILDER ===
function initCanvas() {
    canvas = document.getElementById('workflowCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Canvas event listeners
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('click', handleCanvasClick);

    // Draw initial state
    drawWorkflow();
}

function resizeCanvas() {
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight - 60; // subtract toolbar height
    drawWorkflow();
}

function drawWorkflow() {
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first (so they appear behind nodes)
    workflowConnections.forEach(conn => {
        drawConnection(conn);
    });

    // Draw nodes
    workflowNodes.forEach(node => {
        drawNode(node);
    });
}

function drawNode(node) {
    const colors = {
        trigger: { bg: '#FF6D5A', shadow: 'rgba(255, 109, 90, 0.5)' },
        ai: { bg: '#7B61FF', shadow: 'rgba(123, 97, 255, 0.5)' },
        action: { bg: '#00D4AA', shadow: 'rgba(0, 212, 170, 0.5)' },
        control: { bg: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.5)' }
    };

    const color = colors[node.type] || colors.action;

    // Shadow
    ctx.shadowColor = color.shadow;
    ctx.shadowBlur = node.selected ? 20 : 10;

    // Node background
    ctx.fillStyle = color.bg;
    ctx.beginPath();
    ctx.roundRect(node.x, node.y, node.width, node.height, 12);
    ctx.fill();

    // Selection border
    if (node.selected) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Reset shadow
    ctx.shadowBlur = 0;

    // Node text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, node.x + node.width / 2, node.y + node.height / 2);

    // Node icon (simplified - would use actual icons in production)
    ctx.font = '20px FontAwesome';
    ctx.fillText(getNodeIcon(node.type), node.x + node.width / 2, node.y + 25);
}

function drawConnection(conn) {
    const fromNode = workflowNodes.find(n => n.id === conn.from);
    const toNode = workflowNodes.find(n => n.id === conn.to);

    if (!fromNode || !toNode) return;

    const fromX = fromNode.x + fromNode.width;
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x;
    const toY = toNode.y + toNode.height / 2;

    // Draw curved line
    ctx.strokeStyle = '#7B61FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);

    const controlPointOffset = Math.abs(toX - fromX) / 2;
    ctx.bezierCurveTo(
        fromX + controlPointOffset, fromY,
        toX - controlPointOffset, toY,
        toX, toY
    );
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowSize = 10;
    ctx.fillStyle = '#7B61FF';
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - arrowSize * Math.cos(angle - Math.PI / 6),
        toY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        toX - arrowSize * Math.cos(angle + Math.PI / 6),
        toY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

function getNodeIcon(type) {
    const icons = {
        trigger: '⚡',
        ai: '🧠',
        action: '⚙️',
        control: '🔀'
    };
    return icons[type] || '📦';
}

// Canvas interaction handlers
function handleCanvasMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    for (let i = workflowNodes.length - 1; i >= 0; i--) {
        const node = workflowNodes[i];
        if (x >= node.x && x <= node.x + node.width &&
            y >= node.y && y <= node.y + node.height) {
            selectedNode = node;
            isDragging = true;
            dragOffset = { x: x - node.x, y: y - node.y };

            // Update selection
            workflowNodes.forEach(n => n.selected = false);
            node.selected = true;
            drawWorkflow();
            break;
        }
    }
}

function handleCanvasMouseMove(e) {
    if (!isDragging || !selectedNode) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedNode.x = x - dragOffset.x;
    selectedNode.y = y - dragOffset.y;

    drawWorkflow();
}

function handleCanvasMouseUp() {
    isDragging = false;
}

function handleCanvasClick(e) {
    if (!isDragging) {
        // Deselect if clicking empty space
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let clickedNode = false;
        workflowNodes.forEach(node => {
            if (x >= node.x && x <= node.x + node.width &&
                y >= node.y && y <= node.y + node.height) {
                clickedNode = true;
            }
        });

        if (!clickedNode) {
            workflowNodes.forEach(n => n.selected = false);
            selectedNode = null;
            drawWorkflow();
        }
    }
}

// === DRAG AND DROP ===
function initDragAndDrop() {
    const draggableNodes = document.querySelectorAll('.draggable-node');

    draggableNodes.forEach(node => {
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('dragend', handleDragEnd);
    });

    if (canvas) {
        canvas.addEventListener('dragover', handleDragOver);
        canvas.addEventListener('drop', handleDrop);
    }
}

let draggedNodeData = null;

function handleDragStart(e) {
    draggedNodeData = {
        type: e.target.dataset.nodeType,
        name: e.target.dataset.nodeName
    };
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();

    if (!draggedNodeData) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 60; // Center the node
    const y = e.clientY - rect.top - 40;

    const newNode = {
        id: Date.now(),
        type: draggedNodeData.type,
        name: draggedNodeData.name,
        x: x,
        y: y,
        width: 120,
        height: 80,
        selected: false
    };

    workflowNodes.push(newNode);

    // Auto-connect to last node if exists
    if (workflowNodes.length > 1) {
        const lastNode = workflowNodes[workflowNodes.length - 2];
        workflowConnections.push({
            from: lastNode.id,
            to: newNode.id
        });
    }

    drawWorkflow();
    logToConsole(`Node "${newNode.name}" added to workflow`);

    draggedNodeData = null;
}

// === WORKFLOW ACTIONS ===
function clearCanvas() {
    if (confirm('Are you sure you want to clear the workflow?')) {
        workflowNodes = [];
        workflowConnections = [];
        selectedNode = null;
        drawWorkflow();
        logToConsole('Workflow cleared', 'warning');
    }
}

function runWorkflow() {
    if (workflowNodes.length === 0) {
        logToConsole('No workflow to execute!', 'error');
        return;
    }

    logToConsole('Starting workflow execution...', 'info');

    // Simulate execution
    let currentStep = 0;
    const executionInterval = setInterval(() => {
        if (currentStep < workflowNodes.length) {
            const node = workflowNodes[currentStep];

            // Highlight current node
            workflowNodes.forEach(n => n.selected = false);
            node.selected = true;
            drawWorkflow();

            logToConsole(`Executing: ${node.name} (${node.type})`, 'success');

            currentStep++;
        } else {
            clearInterval(executionInterval);
            workflowNodes.forEach(n => n.selected = false);
            drawWorkflow();
            logToConsole('Workflow execution completed! ✓', 'success');
        }
    }, 1000);
}

function exportWorkflow() {
    if (workflowNodes.length === 0) {
        alert('No workflow to export!');
        return;
    }

    const workflowData = {
        nodes: workflowNodes.map(n => ({
            id: n.id,
            type: n.type,
            name: n.name,
            position: { x: n.x, y: n.y }
        })),
        connections: workflowConnections
    };

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'n8n-workflow.json';
    link.click();

    logToConsole('Workflow exported successfully!', 'success');
}

function showWorkflowCode() {
    if (workflowNodes.length === 0) {
        alert('No workflow to show!');
        return;
    }

    const workflowData = {
        nodes: workflowNodes.map(n => ({
            id: n.id,
            type: n.type,
            name: n.name,
            position: { x: n.x, y: n.y }
        })),
        connections: workflowConnections
    };

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2><i class="fas fa-code"></i> Workflow JSON</h2>
        <div class="code-example">
            <pre><code>${JSON.stringify(workflowData, null, 2)}</code></pre>
        </div>
        <button class="btn btn-primary" onclick="copyWorkflowJSON()">
            <i class="fas fa-copy"></i> Copy to Clipboard
        </button>
    `;

    document.getElementById('contentModal').classList.add('active');
}

function copyWorkflowJSON() {
    const workflowData = {
        nodes: workflowNodes,
        connections: workflowConnections
    };

    navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2))
        .then(() => {
            alert('JSON copied to clipboard!');
        });
}

// === CONSOLE LOGGING ===
function logToConsole(message, type = 'info') {
    const console = document.getElementById('executionConsole');
    if (!console) return;

    const icons = {
        info: 'ℹ️',
        success: '✓',
        error: '✗',
        warning: '⚠️'
    };

    const colors = {
        info: '#3B82F6',
        success: '#00D4AA',
        error: '#FF6D5A',
        warning: '#F59E0B'
    };

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.padding = '0.5rem';
    logEntry.style.borderLeft = `3px solid ${colors[type]}`;
    logEntry.style.marginBottom = '0.5rem';
    logEntry.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    logEntry.style.borderRadius = '4px';
    logEntry.innerHTML = `
        <span style="color: ${colors[type]}">[${timestamp}]</span>
        <span style="color: ${colors[type]}">${icons[type]}</span>
        ${message}
    `;

    // Remove welcome message if it exists
    const welcome = console.querySelector('.console-welcome');
    if (welcome) {
        welcome.remove();
    }

    console.appendChild(logEntry);
    console.scrollTop = console.scrollHeight;
}

// === TEMPLATES ===
function loadTemplate(templateName) {
    const templates = {
        'ai-assistant': {
            nodes: [
                { id: 1, type: 'trigger', name: 'Chat Trigger', x: 50, y: 150, width: 120, height: 80, selected: false },
                { id: 2, type: 'ai', name: 'AI Agent', x: 220, y: 150, width: 120, height: 80, selected: false },
                { id: 3, type: 'action', name: 'HTTP Request', x: 390, y: 100, width: 120, height: 80, selected: false },
                { id: 4, type: 'action', name: 'Send Email', x: 390, y: 200, width: 120, height: 80, selected: false }
            ],
            connections: [
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 2, to: 4 }
            ]
        },
        'web-scraper': {
            nodes: [
                { id: 1, type: 'trigger', name: 'Schedule', x: 50, y: 150, width: 120, height: 80, selected: false },
                { id: 2, type: 'action', name: 'HTTP Request', x: 220, y: 150, width: 120, height: 80, selected: false },
                { id: 3, type: 'control', name: 'Loop', x: 390, y: 150, width: 120, height: 80, selected: false },
                { id: 4, type: 'action', name: 'Google Sheets', x: 560, y: 150, width: 120, height: 80, selected: false }
            ],
            connections: [
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 3, to: 4 }
            ]
        },
        'email-automation': {
            nodes: [
                { id: 1, type: 'trigger', name: 'Email Trigger', x: 50, y: 150, width: 120, height: 80, selected: false },
                { id: 2, type: 'ai', name: 'OpenAI', x: 220, y: 150, width: 120, height: 80, selected: false },
                { id: 3, type: 'control', name: 'IF', x: 390, y: 100, width: 120, height: 80, selected: false },
                { id: 4, type: 'action', name: 'Send Reply', x: 560, y: 100, width: 120, height: 80, selected: false }
            ],
            connections: [
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 3, to: 4 }
            ]
        },
        'data-sync': {
            nodes: [
                { id: 1, type: 'trigger', name: 'Webhook', x: 50, y: 150, width: 120, height: 80, selected: false },
                { id: 2, type: 'action', name: 'Database', x: 220, y: 150, width: 120, height: 80, selected: false },
                { id: 3, type: 'action', name: 'Google Sheets', x: 390, y: 100, width: 120, height: 80, selected: false },
                { id: 4, type: 'action', name: 'Send Email', x: 390, y: 200, width: 120, height: 80, selected: false }
            ],
            connections: [
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 2, to: 4 }
            ]
        }
    };

    const template = templates[templateName];
    if (template) {
        workflowNodes = JSON.parse(JSON.stringify(template.nodes));
        workflowConnections = JSON.parse(JSON.stringify(template.connections));
        drawWorkflow();
        logToConsole(`Template "${templateName}" loaded successfully!`, 'success');

        // Scroll to playground
        scrollToSection('interactive');
    }
}

// === HELPER: Round Rectangle ===
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    // Delete selected node
    if (e.key === 'Delete' && selectedNode) {
        workflowNodes = workflowNodes.filter(n => n.id !== selectedNode.id);
        workflowConnections = workflowConnections.filter(c =>
            c.from !== selectedNode.id && c.to !== selectedNode.id
        );
        selectedNode = null;
        drawWorkflow();
        logToConsole('Node deleted', 'warning');
    }

    // Escape to deselect
    if (e.key === 'Escape') {
        workflowNodes.forEach(n => n.selected = false);
        selectedNode = null;
        drawWorkflow();
    }
});

// === EXPORT GLOBAL FUNCTIONS ===
window.scrollToSection = scrollToSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.highlightNodeType = highlightNodeType;
window.animateAgentFlow = animateAgentFlow;
window.clearCanvas = clearCanvas;
window.runWorkflow = runWorkflow;
window.exportWorkflow = exportWorkflow;
window.showWorkflowCode = showWorkflowCode;
window.copyWorkflowJSON = copyWorkflowJSON;
window.loadTemplate = loadTemplate;