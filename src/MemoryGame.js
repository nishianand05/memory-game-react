import React, {Component} from 'react';
import shuffle from 'shuffle-array';
import Navbar from './Navbar';
import Card from './Card';

const CardState = {
	HIDING: 0,
	SHOWING: 1,
	MATCHING: 2
}

class MemoryGame extends Component {
	
	constructor(props){
		super(props);
		
		let cards = [
			{id: 0, cardState: CardState.HIDING, backgroundColor: 'red'},
			{id: 1, cardState: CardState.HIDING, backgroundColor: 'red'},
			{id: 2, cardState: CardState.HIDING, backgroundColor: 'navy'},
			{id: 3, cardState: CardState.HIDING, backgroundColor: 'navy'},
			{id: 4, cardState: CardState.HIDING, backgroundColor: 'green'},
			{id: 5, cardState: CardState.HIDING, backgroundColor: 'green'},
			{id: 6, cardState: CardState.HIDING, backgroundColor: 'yellow'},
			{id: 7, cardState: CardState.HIDING, backgroundColor: 'yellow'},
			{id: 8, cardState: CardState.HIDING, backgroundColor: 'black'},
			{id: 9, cardState: CardState.HIDING, backgroundColor: 'black'},
			{id: 10, cardState: CardState.HIDING, backgroundColor: 'purple'},
			{id: 11, cardState: CardState.HIDING, backgroundColor: 'purple'},
			{id: 12, cardState: CardState.HIDING, backgroundColor: 'pink'},
			{id: 13, cardState: CardState.HIDING, backgroundColor: 'pink'},
			{id: 14, cardState: CardState.HIDING, backgroundColor: 'lightskyblue'},
			{id: 15, cardState: CardState.HIDING, backgroundColor: 'lightskyblue'}
		];
		cards = shuffle(cards);
		
		
		this.state = {cards, noClick: false};
		
		this.handleClick = this.handleClick.bind(this);		
		this.handleNewGame = this.handleNewGame.bind(this);
	}
	
	handleNewGame(){
		
		// Set card state to hiding and shuffle
		let cards = this.state.cards.map(c => ({
			...c, 
			cardState: CardState.HIDING
		}))
		cards = shuffle(cards);
		
		this.setState({cards});
	}
	
	handleClick(id){
		
		const mapCardState = (cards, idsToChange, newCardState) => {
			return cards.map(c => {
				//Find ids selected and return cards with new cardState
				if(idsToChange.includes(c.id)) {
					return {
						...c, cardState: newCardState
					};
				}
				return c;
			});
		}
		
		//Find cards with matching id
		const foundCard = this.state.cards.find(c => c.id === id);
		
		// If no click is true or foundCard state is not HIDING - return 
		if(this.state.noClick || foundCard.cardState !== CardState.HIDING){
			return;
		}
		
		// Set no click to false
		let noClick = false;
		
		// Call mapCardState function
		let cards = mapCardState(this.state.cards, [id], CardState.SHOWING);
		
		// Filter out cards with card state equal to showing
		const showingCards = cards.filter((c) => c.cardState === CardState.SHOWING);
		
		// Get ids of cards that are showing
		const ids = showingCards.map(c => c.id);
		
		if(showingCards.length === 2 && showingCards[0].backgroundColor === showingCards[1].backgroundColor){
			// If 2 cards are showing and backgroundColor is equal for both, call mapCardState to set card state as matching
			cards = mapCardState(cards, ids, CardState.MATCHING);
		
		} else if (showingCards.length === 2){
			// If 2 cards are showing but do not match - set card state to hiding
			let hidingCards = mapCardState(cards, ids, CardState.HIDING);
			
			// set no click to false after 1300ms
			noClick = true;
			
			this.setState({cards, noClick}, () => {
				setTimeout(() => {
					this.setState({cards: hidingCards, noClick: false});
				}, 1300);
			});
			
			return;
		}
		
		this.setState({cards, noClick});
	}
	
	render(){
		
		const cards = this.state.cards.map((card) => (
			<Card 
				key={card.id}
				showing={card.cardState !== CardState.HIDING}
				backgroundColor={card.backgroundColor}
				onClick={() => this.handleClick(card.id)}/>
		));
		
		return (
			<div>
				<Navbar onNewGame = {this.handleNewGame}/>
				<div className='cards-body'>
					{cards}
				</div>
			</div>
		);
	}
}

export default MemoryGame;