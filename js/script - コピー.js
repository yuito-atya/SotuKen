let card ="";
let card2="";
let openCard=[];
let selectCard=[];
let weapon="";
let portion="";

//ページのロード時に実行
window.addEventListener("load", async() => {
    //使うデッキの作成
    const apiUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,AC,2S,2D,2C,2H,3S,3D,3C,3H,4S,4D,4C,4H,5S,5D,5C,5H,6S,6D,6C,6H,7S,7D,7C,7H,8S,8D,8C,8H,9S,9D,9C,9H,10S,10D,10C,10H,11S,11C,12S,12C,13S,13C";
    const response = await fetch(apiUrl);
    card = await response.json();
    console.log(card);
 });

 
document.getElementById("buttonGet").addEventListener("click", async () => {
    selectCard.length=0;
    console.log("削除された配列:"+selectCard);
    const deckId = card.deck_id;
    const api2Url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`;
    const response2 = await fetch(api2Url);
    card2 = await response2.json();
    console.log(card2);
    for(let cnt = 0;0<4;cnt++){
        let image = document.createElement("img");
        image.id = cnt;
        image.addEventListener('click', clickListener);
        image.src = card2.cards[cnt].image;
        const numberDiv = document.getElementById(`number${cnt}`);
        numberDiv.innerHTML = "";
        numberDiv.appendChild(image);
        openCard.push(card2.cards[cnt].code); 
        console.log(cnt + openCard);
    }
});

//カードのクリック時に実行
function clickListener (e) {
    const id =e.target.getAttribute("id");
    //
    if(selectCard.includes(id)){
        const element = document.getElementById('aaa'); 
        element.remove();
        console.log("選択済みです:" +selectCard);
    }else{
        let text = document.createElement("p");
        text.textContent="選択済み";
        text.id="delete";
        console.log("text");
        const numberDiv = document.getElementById(`number${id}`);
        numberDiv.appendChild(text);
        console.log("選択しました");
        selectCard.push(e.target.getAttribute("id"));
    }
}


