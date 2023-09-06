//Ayomide Idowu
//11.15.22
//Lottery
import java.util.*;
public class Lottery{
   public static void main(String [] args){
   //setup keyboard scan and randgen
      Scanner scan = new Scanner(System.in);
      Random randGen = new Random();
      System.out.println("Welcome to the Lottery Game!");
      //declaring arrays
      int[] lotteryNumbers=new int[5];
      for(int i=0; i<lotteryNumbers.length; i++){
      lotteryNumbers[i]=randGen.nextInt(9);
      }
      System.out.println("Enter your five guesses for the digits in the lottery!" + "\n" + "Digits must be between 0-9");
      int[] user=new int[5];
      for(int i=0; i<user.length; i++){
      user[i]=scan.nextInt();
      }
      System.out.println("The winning Lottery Number is: ");
      printArray(lotteryNumbers);
      System.out.println("Your Lottery Number guess is: ");
      printArray(user);
      checkForWinner(lotteryNumbers, user);
   }
   //static methods
   public static void printArray(int [] num){
      System.out.print("\t\t\t");
      for(int i=0; i<num.length; i++){
      System.out.print(num[i] + " ");}
      System.out.print("\n");
      }
      //uses nested loops to find matches in the separate arrays
   public static void checkForWinner(int [] win, int [] user){
      int matches = 0;
      for(int i=0; i<5; i++){
         for(int a=0; a<5; a++){
            if(win[i]==user[a]){
               matches = matches + 1;
               }
            if(win[i]==user[a]){
               user[a]=-1;
               break;
               }
            }
         }
         //comments based on the outcome of the matches found
            if(matches != 5){
               System.out.println("There are " + matches + " matching digits.");
               }
            else{
               System.out.println("All of your digits match! You have won the lottery!");
               }
      }
   }
               
            


