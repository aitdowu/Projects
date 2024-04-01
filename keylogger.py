import tkinter as tk
from tkinter import messagebox, simpledialog
from pynput.keyboard import Key, Listener
import logging
import threading
import datetime

#creates new output file for every logging session, designate where you want logs to be stored
logFile = r"(insert filepath here)"
timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
logging.basicConfig(filename=(logFile + f"keystrokeLog_{timestamp}.txt"), level=logging.DEBUG, format='%(asctime)s: %(message)s')

def onPress(key):
    logging.info(str(key))

def startKeylogger():
    with Listener(on_press=onPress) as listener:
        listener.join()

#asks user for consent before running program, will not run unless "yes" is selected   
def confirmation():
    window = tk.Tk()
    window.withdraw() 
    response = messagebox.askyesno("Confirmation", "Do you want to run the keylogger?")
    if response:
      info_window = tk.Toplevel()
      info_window.title("Information")
      info_label = tk.Label(info_window, text="Your keystrokes are now being recorded.", padx=10, pady=10)
      info_label.pack()
      threading.Thread(target=startKeylogger, daemon=True).start()
      info_window.mainloop()
    else:
        window.destroy()

if __name__ == "__main__":
    confirmation()

#kill terminal to stop