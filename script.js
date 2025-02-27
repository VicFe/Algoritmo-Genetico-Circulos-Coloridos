document.addEventListener('DOMContentLoaded', () => {
    const populationSize = 10;
    let population = [];

    const populationDiv = document.getElementById('population');
    const generatePopulationButton = document.getElementById('generatePopulationButton');
    const controlsDiv = document.getElementById('controls');
    const crossoverButton = document.getElementById('crossoverButton');
    const mutationButton = document.getElementById('mutationButton');
    const selectionButton = document.getElementById('selectionButton'); // Novo botão
    const crossoverMethodSelect = document.getElementById('crossoverMethod');
    const mutationMethodSelect = document.getElementById('mutationMethod');

    function generateInitialPopulation(size) {
        return Array.from({ length: size }, () => ({
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        }));
    }

    function renderPopulation() {
        populationDiv.innerHTML = '';
        population.forEach(circle => {
            const circleDiv = document.createElement('div');
            circleDiv.className = 'circle';
            circleDiv.style.backgroundColor = `rgb(${circle.r}, ${circle.g}, ${circle.b})`;
            circleDiv.textContent = `(${circle.r}, ${circle.g}, ${circle.b})`;
            populationDiv.appendChild(circleDiv);
        });
    }

    function fitness(circle) {
        return 255 * 3 - (circle.r + circle.g + circle.b); // Quanto mais escuro, maior a aptidão
    }

    function selection() {
        const totalFitness = population.reduce((sum, circle) => sum + fitness(circle), 0);
        const selected = [];
        for (let i = 0; i < populationSize; i++) {
            let rand = Math.random() * totalFitness;
            let sum = 0;
            for (const circle of population) {
                sum += fitness(circle);
                if (sum >= rand) {
                    selected.push({ ...circle });
                    break;
                }
            }
        }
        return selected;
    }

    function crossover(parent1, parent2, method) {
        const child = {};
        switch (method) {
            case 'onePoint': // Um ponto
                child.r = parent1.r;
                child.g = parent2.g;
                child.b = parent1.b;
                break;
            case 'uniform': // Uniforme
                child.r = Math.random() < 0.5 ? parent1.r : parent2.r;
                child.g = Math.random() < 0.5 ? parent1.g : parent2.g;
                child.b = Math.random() < 0.5 ? parent1.b : parent2.b;
                break;
            case 'arithmetic': // Aritmético
                child.r = Math.floor((parent1.r + parent2.r) / 2);
                child.g = Math.floor((parent1.g + parent2.g) / 2);
                child.b = Math.floor((parent1.b + parent2.b) / 2);
                break;
        }
        return child;
    }

    function mutate(circle, method) {
        switch (method) {
            case 'random': // Aleatória
                circle.r = Math.floor(Math.random() * 256);
                circle.g = Math.floor(Math.random() * 256);
                circle.b = Math.floor(Math.random() * 256);
                break;
            case 'small': // Pequena
                circle.r = Math.max(0, Math.min(255, circle.r + Math.floor(Math.random() * 21 - 10)));
                circle.g = Math.max(0, Math.min(255, circle.g + Math.floor(Math.random() * 21 - 10)));
                circle.b = Math.max(0, Math.min(255, circle.b + Math.floor(Math.random() * 21 - 10)));
                break;
            case 'directed': // Dirigida
                circle.r = Math.max(0, circle.r - 10);
                circle.g = Math.max(0, circle.g - 10);
                circle.b = Math.max(0, circle.b - 10);
                break;
        }
    }

    function applyCrossover() {
        const selected = selection();
        const newPopulation = [];
        const method = crossoverMethodSelect.value;
        for (let i = 0; i < populationSize; i++) {
            const parent1 = selected[Math.floor(Math.random() * selected.length)];
            const parent2 = selected[Math.floor(Math.random() * selected.length)];
            const child = crossover(parent1, parent2, method);
            newPopulation.push(child);
        }
        population = newPopulation;
        renderPopulation();
    }

    function applyMutation() {
        const method = mutationMethodSelect.value;
        population.forEach(circle => {
            if (Math.random() < 0.5) mutate(circle, method); // 50% de chance de mutação
        });
        renderPopulation();
    }

    function applySelection() {
        const selected = selection(); // Aplica a seleção por roleta
        population = selected; // Atualiza a população com os selecionados
        renderPopulation(); // Renderiza a nova população
    }

    generatePopulationButton.addEventListener('click', () => {
        population = generateInitialPopulation(populationSize);
        renderPopulation();
        controlsDiv.style.display = 'block'; // Mostra os controles de crossover, mutação e seleção
    });

    crossoverButton.addEventListener('click', applyCrossover);
    mutationButton.addEventListener('click', applyMutation);
    selectionButton.addEventListener('click', applySelection); // Evento para o novo botão
});