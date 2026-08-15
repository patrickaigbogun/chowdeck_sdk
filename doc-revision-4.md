This is a code examples chapter where you explore the Target SDK through examples of code using the SDK to mirror what actual usage of the SDK might look like in real situations.

The purpose of this section is to give users a good idea of how the SDK is used, why they might need it, why it might be preferable over other existing APIs, such as the REST API, and the kind of flow that the SDK provides that makes it really nice to use.

Rather than simply providing isolated code snippets, the examples should represent realistic workflows.

For example, one common situation is creating orders, which should be a basic thing that people need to do. Normally, to create an order, you might need something like this with the REST API. We can first give an example of what that flow looks like using the REST API.

Then, explain through a code block how the SDK takes all of those things and puts them into a simpler interface. The REST API flow might require several different requests and pieces of code, while the SDK can simplify all of that into something like this.

Looking at the SDK code should make the difference obvious. The service and REST API might provide similar capabilities, but the SDK code should be easier to read, easier to tell where things start and where things end, easier to add different commands, easier to test and debug, and generally easier to work with.

Then we can go through the different things that make the SDK useful and allow the examples to flow naturally.

Rather than making the examples completely separate, a better idea would be something like **Merchant → Order → Payments**, using the SDK.

The examples could flow through different real-world situations, such as:

* Onboarding merchants onto your platform.
* Creating orders.
* Processing orders.
* Making a purchase and processing the payment.
* Fulfilling orders.
* Processing deliveries.

This would allow us to combine the merchants APIs, order APIs, payment APIs, and delivery APIs into a single workflow.

For example, we could show a merchant being onboarded, then show some of the different purchases being made through that merchant, creating an order, making the purchase and paying for it, and then taking that order through the rest of the process until it is delivered.

The delivery API can then be used to show how the order is shipped, either before or after the relevant processing stage, depending on how the workflow works.

The point is to show how different things can be done together and how the SDK code takes all of these APIs and combines them into an easy-to-use workflow.

The SDK provides access to a large number of REST APIs—potentially 50 or more—and the value is not necessarily that it does something that could not be done with those APIs individually. The value is that it combines them into workflows that are easier to use, easier to understand, and easier to maintain across different projects.

These examples should therefore demonstrate the actual flow of using the SDK rather than simply listing what each API can do.

And that's it for the demonstrations, basically.
