//Ayomide Idowu
//4-29-2023
//Blackjack Project

import java.util.LinkedList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class BlackJack{
	//Maps card ranks to numeric values for BlackJack
	public static Map<String, Integer> valueMap = new HashMap<String, Integer>();
	
	public static void main(String[] args) {
		fillMap(); //Fills the map with values for each of the ranks
		
		/**@todo: set up the two empty hands using LinkedLists */
		List<Card> playerHand = new LinkedList<Card>();
		List<Card> dealerHand = new LinkedList<Card>();
		
		
		
		//PLAY BLACKJACK
		System.out.println("Welcome to Blackjack!");
		DeckOfCards deck = new DeckOfCards();
		
		//shuffle the cards
		System.out.println("Shuffling and dealing");
		deck.shuffle();
		
		/**@todo Deal the initial two cards to each player.  Print the player's hand and 
		 * the dealer's first card.
		 */
		playerHand.add(deck.dealCard());
		dealerHand.add(deck.dealCard());
		playerHand.add(deck.dealCard());
		dealerHand.add(deck.dealCard());
		
		System.out.println("Your hand: " + playerHand.get(0) + " and " + playerHand.get(1));
		System.out.println("Dealer's hand: " + dealerHand.get(0));
		
		
		/**@todo implement player logic 
		 * 1) Print current hand value for player
		 * 2) Ask hit or stay
		 * 3) If hit draw card and repeat unless over 21
		 * 4) If stay, move on to dealer
		 */

		/**@todo If player went over 21 print loser message and exit the game
		 * Otherwise print the current hand value for the player */
		while (true) {
			int handValue = countHand(playerHand);
			System.out.println("Your current hand value is: " + handValue + "\n");
			System.out.print("Would you like to hit (h) or stay (s)? \n");
			
			Scanner scanner = new Scanner(System.in);
			String input = scanner.nextLine();
			
			if (input.equals("h")) {
				Card newCard = deck.dealCard();
				System.out.println("You drew " + newCard);
				playerHand.add(newCard);
				if (countHand(playerHand) > 21) {
					System.out.println("Your hand is worth more than 21, you lose! :(");
					System.exit(0);
				}
			} else if (input.equals("s")) {
				break;
			}
		}
	
		/**@todo Draw dealer cards until dealer is >= 17 */
		
		/**@todo Print dealer's hand and value of the hand*/
		
		/**@todo Determine win or tie and print message */
		while (countHand(dealerHand) < 17) {
			Card newCard = deck.dealCard();
			System.out.println("Dealer drew " + newCard);
			dealerHand.add(newCard);
		}
		System.out.println("Your final hand:" + countHand(playerHand));		
		System.out.println("Dealer's final hand:" + countHand(dealerHand) + "\n");
		
		int playerValue = countHand(playerHand);
		int dealerValue = countHand(dealerHand);
		if (playerValue > 21) {
			System.out.println("Your hand is worth more than 21, You lose :(");
		} else if (dealerValue > 21 || playerValue > dealerValue) {
			System.out.println("Congratulations! Your hand is worth less than 21, You win!");
		} else if (playerValue < dealerValue) {
			System.out.println("Sorry, you lose");
		} else {
			System.out.println("It's a tie!");
		}
	}
	
	
	/**
	 * Method to fill the map of values. (Excludes Ace)
	 */
	public static void fillMap() {
		valueMap.put("2", 2);
		valueMap.put("3", 3);
	    valueMap.put("4", 4);
	    valueMap.put("5", 5);
	    valueMap.put("6", 6);
	    valueMap.put("7", 7);
	    valueMap.put("8", 8);
	    valueMap.put("9", 9);
	    valueMap.put("10", 10);
	    valueMap.put("Jack", 10);
	    valueMap.put("Queen", 10);
	    valueMap.put("King", 10);
		//Finish filling in the map of values
		// Up to King, excluding Ace
		
	}
	
	/**
	 * Get the value of a hand of cards
	 * @param hand the current hand of cards
	 * @return The value of the cards (highest under 21 given an ace)
	 */
	public static int countHand(List<Card> hand){
		// Fill in the logic to count the value of a hand
		//Carefully consider how ace(s) change the value of a hand
		//Use the getRank method and the valueMap to find the numeric value 
		// for non-ace cards.  
		int handValue = 0;
	    int numAces = 0;
	    for (Card card : hand) {
	        String rank = card.getRank();
	        if (rank.equals("A")) {
	            numAces++;
	        } else {
	            Integer value = valueMap.get(rank);
	            if (value != null) {
	                handValue += value;
	            }
	        }
	    }
	    for (int i = 0; i < numAces; i++) {
	        if (handValue + 11 <= 21) {
	            handValue += 11;
	        } else {
	            handValue += 1;
	        }
	    }
	    return handValue;
	}
	
}
