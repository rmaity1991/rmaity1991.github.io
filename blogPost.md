<summary>
Python asyncio through practical examples, comparing sequential execution, coroutine-based concurrency, and threading. It explains how async/await and asyncio.gather() help improve performance for I/O-bound tasks by reducing idle wait time. A concise, code-first walkthrough with outputs and key syntax rules makes it easy to understand when and why to use asyncio.
</summary>

We will be discussing the basics of using asyncio in python. Lets us first discuss this using an example.
<code>
from time import perf_counter,sleep

def function1():
    print("Call made to the second function....\n")
    sleep(2)
    print("Second function1 execution completed...\n")


s=perf_counter()
print("The main function is starting...\n")    
function1()
print("Hello World \n")
print("The main function ending ...\n")
print(f"The total time taken is : {perf_counter()-s}")
</code>

Now we will see the output of the program for us to see what has happened.
<code>
The main function is starting...

Call made to the second function....

Second function1 execution completed...

Hello World 

The main function ending ...

The total time taken is : 2.0017361999925924
</code>

Lets see the code execution one by one :

The first function which is the main function is called.
Then the 2nd function called function1() has been called, it starts executing line by line until it reaches the sleep function and waits for 2 seconds.
Then it exits the function1 and returns to the main function.
This type of execution is called sequential function execution.

A coroutine is a function that has the ability to halt its execution before returning and to temporarily transfer control to another coroutine.

To demonstrate this we will use 2 keywords in python called await & async and its uses.

Let’s examine Python’s implementation of async IO now that you have a basic understanding of the idea. Despite having distinct functions, Python’s asyncio module and its two keywords — async and await — work together to facilitate the declaration, development, execution, and management of asynchronous code.

The sleep function from time module & sleep function under asyncio are used as stand-ins for any time-consuming procedures that include wait time. A sleep from time module call that essentially accomplishes nothing more than delay the execution of the function. While asyncio.sleep is used to use a non-blocking call (but one that also takes some time to finish), sleep() can represent any lengthy blocking function call.

It is now necessary to define async, await, and the coroutine functions they produce in a more formal manner. Although this section is a bit lengthy, understanding async/await is crucial, so review it if necessary:

Either an asynchronous generator or a native coroutine is introduced via the syntax async def. As you’ll see later, the terms async with and async for are equally acceptable.

Function control is returned to the event loop by the keyword await. (The surrounding coroutine’s execution is halted.) The event loop is informed by await in this way if Python comes across an await function expression in the scope of main: “Suspend execution of function until whatever I’m waiting on — the result of function— is returned.” Go ahead and run something else in the meanwhile.

Additionally, there are stringent guidelines for when and how to use async/await. Whether you are currently learning the syntax or have experience with async/await, these can be helpful:

A coroutine is a function that is introduced using async def. Although they are all optional, it may employ yield, return, or await. Async def noop(): pass is declared to be valid:

A coroutine function is created by using await and/or return. You have to wait for the results of a coroutine function before calling it.

Using yield in an async def block is less prevalent and has only recently become acceptable in Python. You use async to iterate over the asynchronous generator that is produced by this. For the time being, put async generators out of your mind and concentrate on learning the syntax for coroutine functions, which employ return and/or await.

A SyntaxError will be raised if anything specified with async def is unable to use yield from.

Using await outside of an async def coroutine is a SyntaxError, just as using yield outside of a def function is a SyntaxError. Only in the coroutine’s body may you utilize await.

<code>
import asyncio
from time import perf_counter
count=0
async def function1():
    print(f"I am function {count} printing ones")
    await asyncio.sleep(1)
    print(f"I am function {count} printing twice")

async def main():
    await asyncio.gather(function1(), function1(), function1())

 
if __name__=="__main__":
    print(f"I am main starting..")
    s = perf_counter()
    asyncio.run(main())
    e = perf_counter() - s
    print(f"Main Executed in {e:0.2f} seconds.")
</code>

<code>
I am main starting..
I am function 0 printing ones
I am function 0 printing ones
I am function 0 printing ones
I am function 0 printing twice
I am function 0 printing twice
I am function 0 printing twice
Main Executed in 1.00 seconds.
</code>

Look at the output of our program, we have constructed the program as follows:

We first defined a function with async which means this will now be a separate coroutine which can be part of the asyncio event loop. To make a function part of the event loop of asyncio we will use the asyncio.gather. One thing to remember, we can only call async functions from inside a async function for that, because of this we have defined a async main function. To start the main loop we call the asyncio.run.

As you can see from the output when we gathered the 3 coroutines which are instances of the function1 . Once we call the asyncio.run, the first coroutine is called, and when it reaches the sleep function, the execution of the coroutine is paused and it moves to the next coroutine. As because of this we can see that from the output we have a distributed execution of the all coroutines. To explain this further lets see the next code.

<code>
import asyncio
from time import perf_counter
count=0
async def function1():
    global count
    print(f"I am function which will read the current count which is {count} while beginning to execute")
    count+=1
    await asyncio.sleep(1)
    count-=1
    print(f"I am function which will read the current count which is {count} while ending to execute")

async def main():
    await asyncio.gather(function1(), function1(), function1())

 
if __name__=="__main__":
    print(f"I am main starting..")
    s = perf_counter()
    asyncio.run(main())
    e = perf_counter() - s
    print(f"Main Executed in {e:0.2f} seconds.")
</code>

<code>
I am main starting..
I am function which will read the current count which is 0 while beginning to execute
I am function which will read the current count which is 1 while beginning to execute
I am function which will read the current count which is 2 while beginning to execute
I am function which will read the current count which is 2 while ending to execute
I am function which will read the current count which is 1 while ending to execute
I am function which will read the current count which is 0 while ending to execute
Main Executed in 1.01 seconds.
</code>

We are sharing a common variable between the functions called count. Ones the function increments the count, the next coroutine takes the incremented number and increments it and so on, during the return pass of the functions it decrements a number.

You may be wondering why we will use this type of programming. Lets see what happens without using the asyncio.

<code>
from time import perf_counter,sleep
count=0
def function1():
    global count
    print(f"I am function which will read the current count which is {count} while beginning to execute")
    count+=1
    sleep(1)
    count-=1
    print(f"I am function which will read the current count which is {count} while ending to execute")

if __name__=="__main__":
    print(f"I am main starting..")
    s = perf_counter()
    function1()
    function1()
    function1()
    e = perf_counter() - s
    print(f"Main Executed in {e:0.2f} seconds.")
</code>

<code>
I am main starting..
I am function which will read the current count which is 0 while beginning to execute
I am function which will read the current count which is 0 while ending to execute
I am function which will read the current count which is 0 while beginning to execute
I am function which will read the current count which is 0 while ending to execute
I am function which will read the current count which is 0 while beginning to execute
I am function which will read the current count which is 0 while ending to execute
Main Executed in 3.00 seconds.
</code>

You can easily see the difference of sequential execution. The time and the execution of the function shows the difference between coroutine execution and sequential execution. Now we will look at a threading example for the same function.

<code>
import threading
from time import perf_counter,sleep
count=0
def function1():
    global count
    print(f"I am function which will read the current count which is {count} while beginning to execute")
    count+=1
    sleep(1)
    count-=1
    print(f"I am function which will read the current count which is {count} while ending to execute")

if __name__=="__main__":
    print(f"I am main starting..")
    s = perf_counter()
    x=threading.Thread(target=function1)
    y=threading.Thread(target=function1)
    z=threading.Thread(target=function1)
    x.start()
    y.start()
    z.start()

    x.join()
    y.join()
    z.join()

    e = perf_counter() - s
    print(f"Main Executed in {e:0.2f} seconds.")
</code>

<code>
I am main starting..
I am function which will read the current count which is 0 
while beginning to execute
I am function which will read the current count which is 1 
while beginning to execute
I am function which will read the current count which is 2 
while beginning to execute
I am function which will read the current count which is 2 
while ending to execute
I am function which will read the current count which is 1 
while ending to execute
I am function which will read the current count which is 0 
while ending to execute
Main Executed in 1.00 seconds.
</code>

So, we see no difference between what we did here with asyncio. The difference between the 2 is that, async IO is actually a single-threaded, single-process design that makes use of cooperative multitasking. In other words, even when only one thread is used in a single process, async IO creates the impression of concurrency. Although they can be scheduled concurrently, coroutines — a key component of async IO — are not always concurrent.

