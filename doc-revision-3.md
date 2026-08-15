Getting to this point, we realize that we need to do something about errors. There is no way we would obviously be making all these requests and not encounter at least one error, right?

So, at this point, we need to look at how errors are handled. We have decided that the simplest way to handle this is to allow you to handle the error within your own code.

The reason for this is that, if you have already read the introduction, then we do not need to repeat all of that again here. The goal is to keep things simple within the API.

For errors that are already prepared errors and variations that are created within the codebase, there is no need to add anything extra from our own end. There is no point in returning additional custom errors for errors that already come from the external code or from the base code. That is all from the codebase, and that's it.

This is an in-between first error and that's the entry point. If we look at that, we realize that, of course, some errors come from the base class code—the target error. The base class is arranged like this, and that is not what we are going to call a target error.

So, I think at this point, we can continue from there, just like this, and then complete it. After that, we can now cover a couple of things around the error classes.

All of the error classes are derived from the target error above, and they are as follows.

Each error class explains what is actually contained in the error and what type of error it represents.

After that, the next section should explain how this is used—when it is supposed to be used and how to use it in the code. That's basically the point.

For example, in this situation, we get a default error as the first one. When you get a 4xx status, you have to make a request to the target. If there are requirements for the request, it would look like this, and then you handle it like this.

And, yeah, it is very simple.

Then, we explain the constructor.

As said, although—and then moving on also puts its ending. So, in the error-first section, we return to the process mentioned earlier: the code is supposed to handle the request purpose. That's basically true. We have decided to make this error handling work this way, and we'll leave it like that.

I think the next section is break.
