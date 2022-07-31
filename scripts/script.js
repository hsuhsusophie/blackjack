

let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let winner =0 ; // 0:未定, 1:未定 , 2:莊家贏 , 3:平手

$(document).ready(function(){
    initCards();   //初始化卡牌
    initButtons();  //初始化按鈕
});

function newGame(){
    //初始化
    cleanTable();
    resetGame();

   initCards();
deck = shuffle(buildDeck());
yourDeck.push(deal());
dealerDeck.push(deal());
yourDeck.push(deal());

//開始遊戲
inGame = true;
winner = 0;

renderGameTable();
console.log('New Game!')

}

function deal(){
    return deck.shift();
}

function initButtons(){
    $('#action-new-game').click(evt => newGame());

    //hit stand的行為
    $('#action-hit').click(evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    })

    $('#action-stand').click(evt => {
        evt.preventDefault();
        dealerDeck.push(deal());
        // renderGameTable();
        dealerRound();
    })

}

// function initButtons(){
//     document.querySelector('#action-new-game').addEventListener('click', evt => {

//         });
// }

//卡背面圖樣
function initCards(){
    // let allCard = document.querySelectorAll('.card div');
    // allCard.forEach( card => {
    //     card.innerHTML = '㊖';
    // });

    $('.card div').html('㊖');
}

//創造卡牌應放入牌組中
function buildDeck(){
    let deck = [];
    for(let suit = 1; suit <=4; suit++){
        for(let number = 1; number <= 13; number++){
           let c = new Card(suit, number);
           deck.push(c);
        }
    }
    return deck;
}

//cleanTable 移除原有卡牌
function cleanTable(){
    Deck = [];
    yourDeck = [];
    dealerDeck = [];
    $(".card.yourCard div").empty();
    $(".card span").empty();
}

//洗牌
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }


function renderGameTable(){
    //牌
yourDeck.forEach((card,i) =>{
 let theCard = $(`#yourCard${i + 1 }`);
 theCard.html(card.cardNumber());
 theCard.prev().html(card.cardSuit());
});

dealerDeck.forEach((card,i) =>{
    let theCard = $(`#dealerCard${i + 1 }`);
    theCard.html(card.cardNumber());
    theCard.prev().html(card.cardSuit());
   
   });


   //算點數
   yourPoint = calcPoint(yourDeck);
   dealerPoint = calcPoint(dealerDeck);
    
   //莊家或你任一方>= 21 遊戲結束 按鈕變灰
   if (yourPoint >= 21 || dealerPoint >= 21){
       inGame = false;
   }

  

checkWinner();
showWinStamp();


   $('.your-cards h1').html(`你(${yourPoint}點)`);
   $('.dealer-cards h1').html(`莊家(${dealerPoint}點)`);

   //按鈕
//   if (inGame) {
//       $('#action-hit').attr('disabled',false);
//       $('#action-stand').attr('disabled',false);
//   }else{
//     $('#action-hit').attr('disabled',true);
//     $('#action-stand').attr('disabled',true);
//   }
$('#action-hit').attr('disabled',!inGame)
$('#action-stand').attr('disabled',!inGame)
}

function checkWinner(){
 //算輸贏
 switch(true){ 
    // 如果玩家21點 
case yourPoint ==21:
    winner = 1;
    break;
     
    //如果點數爆掉
case yourPoint > 21:
   winner = 2;
   break;

case dealerPoint > 21:
    winner = 1;
    break;

case dealerPoint == yourPoint:
    winner = 3;
    break;

  // 0.比點數
  case dealerPoint > yourPoint:
    winner = 2;
    break;

default:
    winner = 0;
    break;
}
}

function showWinStamp(){
    switch(winner){
        case 1:
            $('.your-cards').addClass('win');
            break;
    
        case 2:
            $('.dealer-cards').addClass('win');
            break;    
    
        case 3://平手
        $('.your-cards').addClass('tie');
        
            break;
    
           default:
               break;
    }

}




function calcPoint(deck){
    let point = 0;

    deck.forEach(card =>{
        point += card.cardPoint();
        
    });


    //如果大於21 Ａ當1
    if (point > 21) {
        deck.forEach(card =>{
            if (card.cardNumber() === 'A'){
                point -=10;
            }
        })
    }
    return point;
}


function resetGame(){
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    winner = 0;
}

function dealerRound(){
    //1. 發牌
    //2. 如果點數 >=玩家 結束 莊家贏
    //3. < 玩家 繼續發 重複
    //4. 爆了 結束 玩家贏

while(true){
    dealerPoint = calcPoint(dealerDeck);
    if (dealerPoint < yourPoint) {
        dealerDeck.push(deal());
    }else{
        break;
    }
}

inGame = false;
renderGameTable();
}
    


class Card{
    constructor(suit, number){
        this.suit = suit;
        this.number = number;
    }

//牌面
cardNumber(){
    switch(this.number){
        case 1:
            return 'A';
        case 11:
            return 'J';
        case 12:
            return 'Q';
        case 13:
            return 'K';
        default:
            return this.number;

    }
}

//點數
    cardPoint(){
        switch(this.number){
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;
            default:
                return this.number;
        }
    }

//卡牌花色
    cardSuit(){     
        switch(this.suit){
            case 1:
                return '♣';
            case 2:
                return '♠';
            case 3:
                return '♥';
            case 4:
                return '♦';
        }
    }}

