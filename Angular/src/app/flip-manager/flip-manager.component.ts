import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ICard } from '../interface/ICard'
import { ICardResponse } from '../interface/ICardReponse';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-flip-manager',
  templateUrl: './flip-manager.component.html',
  styleUrls: ['./flip-manager.component.css'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))
    ]),
    trigger('CardFlipState', [
      state('open', style({
        transform: 'rotateY(360deg)',
        //opacity: 1
      })),
      state('close', style({
        transform: 'rotateY(36deg)',
        //opacity: 1
      })),
      state('new', style({
        transform: 'rotateY(36deg)',
        //opacity: 1
      })),
      state('done', style({
        //transform: 'rotateY(36deg)',
        opacity: 0.4,
        'pointer-events': 'none'
      })),


      transition('close => open', animate('500ms ease')),
      transition('open => close', animate('500ms ease')),

/*      transition('open => close', [ // each time the binding value changes
        query(':enter', [
          stagger(1000, [
            animate('500ms ease')
          ])
        ])]),
      transition('close => open', [ // each time the binding value changes
        query(':enter', [
          stagger(1000, [
            animate('500ms ease')
          ])
        ])]),
      */
      transition('new => open', animate('500ms ease')),
      transition('new => done', animate('500ms ease')),
      transition('close => done', animate('500ms ease'))
    ])
  ]
})

export class FlipManagerComponent implements OnInit {

  title: string;
  message: string;
  lastchoosen: string;
  animating: boolean;
  flipcount: number;

  cardList: ICard[] = [];

  show = false;

  get stateName() {
    return this.show ? 'show' : 'hide'
  }


  toggle() {
    this.show = !this.show;
  }

 


  constructor(private http: HttpClient) {
    this.title = "Welcome to the Flip game!!.";
    this.message = "";
    this.lastchoosen = "";
    this.animating = false;
    this.flipcount = 0;
  }

  ngOnInit() {
  }

 shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
  }

 onClick(card: ICard)
 {
   if (this.animating)
     return;

   this.animating = true;
   this.flipcount++;
   this.Log('click called');
   card.showImage = card.image;
   card.flip = 'open';
 }

 onDone($event, card) {
   //card.flip = 'close';
   if (card.flip === "open") {



     this.Log('OnDone Called');
     var that = this;
     //setTimeout(function () {
     that.Validate(card, that);

     //}, 100);
   }
   
 }

 Validate(card: ICard, that)
 {
   this.Log('Validate Called');
   if (that.lastchoosen === "")
     that.lastchoosen = card.code;
   else {
     if (card.code === that.lastchoosen) {
       that.cardList.forEach(function (data) {
         if (data.code == card.code) {
           //data.show = false;
           that.Log('Disabling');
           data.flip = 'done';
         }
       });
     }
     else {
       that.cardList.forEach(function (data) {
         if (data.flip === 'open')
         {
           data.showImage = "../../assets/card.jpg";
           data.flip = 'close';
         }
       });
     }

     that.lastchoosen = "";
   }

   that.animating = false;
 }


 OnCardClick(card: ICard) {
   //alert('clicked once' + card.code);
   //card.show = false;
//   card.flip = true;
  this.onClick(card);
 }

 Log(message: string) {
   console.log(message);
 }
 
  newgame() {
    this.message = "Started new game";
    this.cardList = [];
    this.lastchoosen = "";
    this.flipcount = 0;

    return this.http.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .subscribe((resp: any) => {
        var deckID = resp.deck_id;
        var cardURL: string = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=8";
        this.http.get<ICardResponse>(cardURL)
          .subscribe(resp1 => {
            //this.cardList = resp1.cards;
            resp1.cards.forEach(card => {
              this.cardList.push({
                image: card.image, code: card.code, show: true, flip: 'new', showImage: "../../assets/card.jpg" });
              this.cardList.push({
                image: card.image, code: card.code, show: true, flip: 'new', showImage: "../../assets/card.jpg" });
            });

            /*for (let card in resp1.cards) {
              this.cardList.push(card);
            }*/

           this.shuffle(this.cardList);

           this.cardList.forEach(card => {
             this.Log(card.image + ':' + card.flip + ':' + card.show);
           });

            
          });
      });
    
  }
}
