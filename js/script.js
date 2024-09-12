let card ="";
let openCard=[];
let selectedCards=[];
let selected=0;
let restCards = 4;
let hp = 20; 
let weapon=0;
let portion=0;
let times=0;
let deckId="";
let restCard=""; 
let oneMoreTime=0;

//ページのロード時に実行
window.addEventListener("load", async() => {
    //使うデッキの作成
    const apiUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,AC,2S,2D,2C,2H,3S,3D,3C,3H,4S,4D,4C,4H,5S,5D,5C,5H,6S,6D,6C,6H,7S,7D,7C,7H,8S,8D,8C,8H,9S,9D,9C,9H,0S,0D,0C,0H,JS,JC,QS,QC,KS,KC";
    const response = await fetch(apiUrl);
    card = await response.json();
    console.log(card)
    deckId = card.deck_id;
    //最初の4枚を表示
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
        .then(response => response.json())
        .then(data => {
            room = data.cards;
            openCard.push(room);
            console.log(openCard);
            console.log("openCardの長さは"+ openCard[0].length)
            const roomDiv = document.getElementById('room');
            roomDiv.innerHTML = ''; 
            room.forEach((card,index) => {
                const img = document.createElement('img');
                img.src = card.image;
                img.addEventListener('click',()=>chooseCards(img, index));
                img.className = 'card';
                img.id=`${index}`;
                roomDiv.appendChild(img);
            });
        });
        document.getElementById('oneMore').disabled = false;
 });

// カードを選択(強調表示)
function chooseCards (img,index) {
    if(selected ==0 && openCard[0].length == 4){
        if (selectedCards.length < 3 && !selectedCards.includes(index)) {
            selectedCards.push(index);
            img.classList.add('selected');
        } else if (selectedCards.includes(index)) {
            selectedCards = selectedCards.filter(i => i !== index);
            img.classList.remove('selected'); 
        }
        //カードを決定ボタンのON,OFF
        document.getElementById('chosenCards').disabled = selectedCards.length !== 3;
    }else if(selected ==0 && openCard[0].length <4){
        if (selectedCards.length < 3 && !selectedCards.includes(index)) {
            selectedCards.push(index);
            img.classList.add('selected');
        } else if (selectedCards.includes(index)) {
            selectedCards = selectedCards.filter(i => i !== index);
            img.classList.remove('selected'); 
        }
        //カードを決定ボタンのON,OFF
        document.getElementById('chosenCards').disabled = selectedCards.length !== openCard[0].length;
    }else{

        const selectId =img.id;
        const card = openCard[0][selectId].code;
        console.log(card); 
        if (selectedCards.length < 1 && !selectedCards.includes(index)) {
            selectedCards.push(index);
            img.classList.add('selected');
            if(card.includes('S') || card.includes('C')){
                document.getElementById('chooseEnemy').disabled = false;
            }else if(card.includes('D')){
                document.getElementById('chooseWeapon').disabled = false;
            }else{
                document.getElementById('choosePortion').disabled = false;
            }
        } else if (selectedCards.includes(index)) {
            selectedCards = selectedCards.filter(i => i !== index);
            img.classList.remove('selected'); 
            if(card.includes('S') || card.includes('C')){
                document.getElementById('chooseEnemy').disabled = true;
            }else if(card.includes('D')){
                document.getElementById('chooseWeapon').disabled = true;
            }else{
                document.getElementById('choosePortion').disabled = true;
            }
        }
    }
    
}
//カードを3枚だけ表示
function chosenCards() {
    console.log(selectedCards)
    for(let cnt = 0; cnt<openCard[0].length;cnt++){
        const imgDiv = document.getElementById(`${cnt}`);
        if(selectedCards.includes(cnt)){
            imgDiv.classList.remove('selected'); 
        }else{
            restCard = openCard[0][cnt].code
            imgDiv.remove();
        }
    }
    selectedCards.length=0;
    selected = 1;
    document.getElementById('chosenCards').disabled = true;
    restCards -=1;
    if(portion > 0){
        document.getElementById('usePortion').disabled = false;
    }
    document.getElementById('oneMore').disabled = true;
}

//------------------------------------------------------------------  敵を攻撃  -------------------------------------------------------------
function chooseEnemy(){
    console.log(`Enemy:` + selectedCards);
    const card = openCard[0][selectedCards].code.slice(0, -1);
    switch(card){
        case 'A':
            hp =  (parseInt(hp)+ parseInt(weapon)) -14; 
            document.getElementById('hp').textContent = hp;
            break;
        case 'J':
            hp =  (parseInt(hp)+ parseInt(weapon)) -11; 
            document.getElementById('hp').textContent = hp;
            break;
        case 'Q':
            hp =  (parseInt(hp)+ parseInt(weapon)) -12; 
            document.getElementById('hp').textContent = hp;
            break;
        case 'K':
            hp =  (parseInt(hp)+ parseInt(weapon)) -13; 
            document.getElementById('hp').textContent = hp;
            break;
        case '0':
            hp =  (parseInt(hp)+ parseInt(weapon)) -10; 
            document.getElementById('hp').textContent = hp;
            break;
        default:
            if(weapon > card){ 
                document.getElementById('hp').textContent = hp;
                break;
            }else{
                const damage = card - weapon;
                hp = hp - damage; 
                document.getElementById('hp').textContent = hp;
                break;
            }
    }
    if(hp < 1){
        gameOver();
    }
    const imgDiv = document.getElementById(`${selectedCards}`);
    imgDiv.remove();
    selectedCards.length=0;
    document.getElementById('chooseEnemy').disabled = true;
    restCards -=1;
    if(restCards <= 0){
        document.getElementById('nextTurn').disabled = false;
    }
}

//武器を装備
function chooseWeapon(){
    if(weapon != 0){

    }else{
        const card = openCard[0][selectedCards].code.slice(0, -1);
        if(card ==0){
            weapon = 10;
        }else{
            weapon = card;
        }
        document.getElementById('weapon').textContent = weapon;
    }
    const imgDiv = document.getElementById(`${selectedCards}`);
    imgDiv.remove();
    selectedCards.length=0;
    document.getElementById('chooseWeapon').disabled = true;
    restCards -=1;
    if(restCards <= 0){
        document.getElementById('nextTurn').disabled = false;
    }
}

//ポーションを装備
function choosePortion(){
    if(portion != 0){

    }else{
        //ポーションを装備していないとき
        const card = openCard[0][selectedCards].code.slice(0, -1);
        if(card ==0){
            portion = 10;
        }else{
            portion = card;
        }
        document.getElementById('portion').textContent = portion;
        if(times==0){
            document.getElementById('usePortion').disabled = false;
        }else{

        }
        
    }
    const imgDiv = document.getElementById(`${selectedCards}`);
    imgDiv.remove();
    selectedCards.length=0;
    document.getElementById('choosePortion').disabled = true;
    restCards -=1;
    if(restCards <= 0){
        document.getElementById('nextTurn').disabled = false;
    }
}
//ポーションを使用
function usePortion(){
    if(times == 0 ){
        if((parseInt(hp)+ parseInt(portion))>20){
            hp = 20;
        }else{
            hp = (parseInt(hp)+ parseInt(portion));
        }
        document.getElementById('hp').textContent = hp;
        document.getElementById('portion').textContent = 0;
        document.getElementById('usePortion').disabled = true;
        times += 1;
        if(restCards == 0){
            document.getElementById('nextTurn').disabled = false;
        }
        portion = 0;
    }
}

//次のターンへ
function nextTurn(){
    openCard.length=0;
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${restCard}`)
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
    .then(response => response.json())
    .then(data => {
        room = data.cards;
        openCard.push(room);
        restCards = openCard[0].length;
        const roomDiv = document.getElementById('room');
        roomDiv.innerHTML = ''; 
        room.forEach((card,index) => {
            const img = document.createElement('img');
            img.src = card.image;
            img.addEventListener('click',()=>chooseCards(img, index));
            img.className = 'card';
            img.id=`${index}`;
            console.log(img.id)
            roomDiv.appendChild(img);
        });
    });
    //変数初期化
    times =0;
    selected=0;
    oneMoreTime=0;
    document.getElementById('usePortion').disabled = true;
    document.getElementById('nextTurn').disabled = true;
    document.getElementById('oneMore').disabled = false;
}

function gameOver(){
    window.location.href = 'yuito.html';
    document.getElementById('score').textContent = 1;
    console.log(ゲームオーバー);
}

function restart(){
    window.location.href = 'HighLow.html';
}

function oneMore(){
    if(oneMoreTime==0){
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${openCard[0][0].code}`)
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${openCard[0][1].code}`)
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${openCard[0][2].code}`)
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${openCard[0][3].code}`)
        openCard.length=0;
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
        .then(response => response.json())
        .then(data => {
            room = data.cards;
            openCard.push(room);
            restCards = openCard[0].length;
            const roomDiv = document.getElementById('room');
            roomDiv.innerHTML = ''; 
            room.forEach((card,index) => {
                const img = document.createElement('img');
                img.src = card.image;
                img.addEventListener('click',()=>chooseCards(img, index));
                img.className = 'card';
                img.id=`${index}`;
                console.log(img.id)
                roomDiv.appendChild(img);
            });
        });
        //変数初期化
        times =0;
        selected=0;
        selectedCards.length=0;
        document.getElementById('chosenCards').disabled = true;
        document.getElementById('usePortion').disabled = true;
        document.getElementById('nextTurn').disabled = true;
        oneMoreTime=1;
        document.getElementById('oneMore').disabled = true;
    }else{
        
    }
}
