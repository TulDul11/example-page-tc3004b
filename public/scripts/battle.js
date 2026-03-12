let pokemonList = [];
let confirmed1 = false;
let confirmed2 = false;

const select1 = document.getElementById("pokemon-select-1");
const select2 = document.getElementById("pokemon-select-2");
const img1 = document.getElementById("pokemon-img-1");
const img2 = document.getElementById("pokemon-img-2");
const name1 = document.getElementById("pokemon-name-1");
const name2 = document.getElementById("pokemon-name-2");
const confirm1 = document.getElementById("confirm-1");
const confirm2 = document.getElementById("confirm-2");
const fightBtn = document.getElementById("fight-btn");
const maxTurnsInput = document.getElementById("max-turns");
const battleLog = document.getElementById("battle-log");
const hpContainer1 = document.getElementById("hp-container-1");
const hpContainer2 = document.getElementById("hp-container-2");
const hpFill1 = document.getElementById("hp-fill-1");
const hpFill2 = document.getElementById("hp-fill-2");
const hpText1 = document.getElementById("hp-text-1");
const hpText2 = document.getElementById("hp-text-2");

function formatName(name){
    return name.toUpperCase();
};
async function loadPokemon(){
    try{
        const res = await fetch("/api/pokemon/all");
        const result = await res.json();

        pokemonList = result.data;

        populateSelects();

    }catch(err){
        console.error("Failed to load pokemon", err);
    }
};
function populateSelects(){
    pokemonList.forEach(pokemon => {

        const option1 = document.createElement("option");
        option1.value = pokemon.id;
        option1.textContent = pokemon.name.toUpperCase();

        const option2 = option1.cloneNode(true);

        select1.appendChild(option1);
        select2.appendChild(option2);

    });
};
function updatePreview(player){
    const select = player === 1 ? select1 : select2;
    const img = player === 1 ? img1 : img2;
    const name = player === 1 ? name1 : name2;

    const id = Number(select.value);

    const pokemon = pokemonList.find(p => p.id === id);

    if(!pokemon) return;

    img.src = pokemon.image;
    name.textContent = pokemon.name.toUpperCase();
};
function checkFightReady(){
    if(confirmed1 && confirmed2){

        fightBtn.disabled = false;

    }
};
function createBattlePokemon(base){
    return {
        id: base.id,
        name: base.name,
        image: base.image,

        hp: 100,

        attack: randomStat(),
        defense: randomStat(),
        spAttack: randomStat(),
        spDefense: randomStat(),

        specialAttackCD: 0,
        specialDefenseCD: 0,

        defending: false,
        specialDefending: false
    };
};
function updateCooldowns(p){
    if(p.specialAttackCD > 0) p.specialAttackCD--;
    if(p.specialDefenseCD > 0) p.specialDefenseCD--;
};
function randomStat(){
    return Math.floor(Math.random()*30)+10;
};
function randomAction(p){
    const actions = ["attack","defense"];

    if(p.specialAttackCD === 0){
        actions.push("specialAttack");
    }

    if(p.specialDefenseCD === 0){
        actions.push("specialDefense");
    }

    return actions[Math.floor(Math.random()*actions.length)];
};
function actionFails(){
    return Math.random() < 0.2;
};
function calculateDamage(attacker, defender, type){
    let atkStat;
    let defStat;

    if(type === "attack"){
        atkStat = attacker.attack;
        defStat = defender.defense;
    }
    else{
        atkStat = attacker.spAttack;
        defStat = defender.spDefense;
    }

    const damage = Math.max(5, atkStat - defStat/2);

    return Math.floor(damage);

};
function log(msg){
    battleLog.innerHTML += msg + "<br>";
    battleLog.scrollTop = battleLog.scrollHeight;
};
function executeTurn(p1, p2){
    p1.defending = false;
    p2.defending = false;
    p1.specialDefending = false;
    p2.specialDefending = false;

    const action1 = randomAction(p1);
    const action2 = randomAction(p2);

    log(`${formatName(p1.name)} chose ${action1.toUpperCase()}`);
    log(`${formatName(p2.name)} chose ${action2.toUpperCase()}`);

    resolveDefense(p1,action1);
    resolveDefense(p2,action2);

    resolveAttack(p1,p2,action1);
    resolveAttack(p2,p1,action2);

    applyCooldowns(p1,action1);
    applyCooldowns(p2,action2);

    updateCooldowns(p1);
    updateCooldowns(p2);
};
function resolveDefense(pokemon, action){
    if(action === "defense"){
        pokemon.defending = true;
        log(`${formatName(pokemon.name)} is DEFENDING`);
    }
    if(action === "specialDefense"){
        pokemon.specialDefending = true;
        log(`${formatName(pokemon.name)} used SPECIAL DEFENSE`);
    }
};
function resolveAttack(attacker ,defender, action){
    if(action !== "attack" && action !== "specialAttack"){
        return;
    }

    if(actionFails()){
        log(`${formatName(attacker.name)} tried ${action.toUpperCase()} but FAILED`);
        return;
    }

    let damage = calculateDamage(attacker,defender,action);

    if(defender.defending){
        damage *= 0.5;
        log(`${formatName(defender.name)} reduced damage with DEFENSE`);
    }

    if(defender.specialDefending){
        damage *= 0.4;
        log(`${formatName(defender.name)} reduced damage with SPECIAL DEFENSE`);
    }

    damage = Math.floor(damage);

    defender.hp -= damage;

    if(defender.hp < 0){
        defender.hp = 0;
    }

    log(`${formatName(attacker.name)} used ${action.toUpperCase()} dealing ${damage}`);
};
function applyCooldowns(pokemon, action){
    /* 
    Los cooldowns son 1 mas que la cantidad necesaria por como son calculados 
    De esta forma, si queremos que haya 2 turnos entre un movimiento especial, el cooldown tiene que ser 3.
    */
    if(action === "specialAttack"){
        pokemon.specialAttackCD = 4;
    }
    if(action === "specialDefense"){
        pokemon.specialDefenseCD = 3; 
    }
};
async function simulateBattle(p1, p2, maxTurns){
    let turn = 1;

    while(p1.hp > 0 && p2.hp > 0 && turn <= maxTurns){

        log("Turn " + turn);
        await sleep(800);

        executeTurn(p1,p2);
        updateHPBars(p1,p2);
        await sleep(800);

        log(`${formatName(p1.name)} HP: ${p1.hp}`);
        log(`${formatName(p2.name)} HP: ${p2.hp}`);
        log("----------------");

        turn++;

    }

    decideWinner(p1,p2);
};
function decideWinner(p1,p2){
    if(p1.hp <= 0 && p2.hp <= 0){
        log("Draw!");
        return;
    }

    if(p1.hp <= 0){
        log(`${formatName(p2.name)} WINS!`);
        return;
    }

    if(p2.hp <= 0){
        log(`${formatName(p1.name)} WINS!`);
        return;
    }

    if(p1.hp > p2.hp){
        log(formatName(p1.name) + " wins by remaining HP!");
    }
    else if(p2.hp > p1.hp){
        log(formatName(p2.name) + " wins by remaining HP!");
    }
    else{
        log("Battle ended in a draw!");
    }

};
function updateHPBars(p1,p2){
    const p1Percent = Math.max(0,(p1.hp/100)*100);
    const p2Percent = Math.max(0,(p2.hp/100)*100);

    hpFill1.style.width = p1Percent + "%";
    hpFill2.style.width = p2Percent + "%";

    hpText1.textContent = `${p1.hp} / 100`;
    hpText2.textContent = `${p2.hp} / 100`;

    updateBarColor(hpFill1,p1Percent);
    updateBarColor(hpFill2,p2Percent);
};
function updateBarColor(bar,percent){
    bar.classList.remove("low","mid");

    if(percent < 30){
        bar.classList.add("low");
    }
    else if(percent < 60){
        bar.classList.add("mid");
    }
};
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
};

select1.addEventListener("change", () => updatePreview(1));
select2.addEventListener("change", () => updatePreview(2));

confirm1.addEventListener("click", () => {
    if(!select1.value) return;

    confirmed1 = true;

    confirm1.textContent = "Confirmed";
    confirm1.disabled = true;

    checkFightReady();
});
confirm2.addEventListener("click", () => {
    if(!select2.value) return;

    confirmed2 = true;

    confirm2.textContent = "Confirmed";
    confirm2.disabled = true;

    checkFightReady();
});

fightBtn.addEventListener("click", () => {
    battleLog.innerHTML = "";

    const p1base = pokemonList.find(p => p.id == select1.value);
    const p2base = pokemonList.find(p => p.id == select2.value);

    const p1 = createBattlePokemon(p1base);
    const p2 = createBattlePokemon(p2base);

    hpContainer1.classList.remove("hidden");
    hpContainer2.classList.remove("hidden");

    const maxTurns = Number(maxTurnsInput.value);

    updateHPBars(p1,p2);

    simulateBattle(p1,p2,maxTurns);

});

loadPokemon();