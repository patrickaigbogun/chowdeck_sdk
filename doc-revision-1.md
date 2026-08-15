## Introduction

Designing an API integration is about more than simply making requests and receiving responses. A good API should reduce the amount of effort required from the developer while providing a consistent and predictable experience.

This design framework is built around that idea. It focuses on making the API intuitive enough that developers can understand how it works without having to constantly refer to extensive documentation or keep additional context in their heads.

### 1. Consistency

The first principle is consistency. The API should follow predictable conventions across its different parts so that once a developer understands one part of the system, they can reasonably understand the rest.

Too much context is expensive. Developers should not have to learn a completely different pattern every time they interact with another endpoint. The same principles, structures, and conventions should apply throughout the API.

### 2. The Code Should Mirror the API

The next principle is that the code should follow the natural structure of the API.

Ideally, the way a developer thinks about performing an action should correspond closely to the way that action is represented in the code. The API should feel like a bridge between the developer's mental model and the actual system.

For example, if an API endpoint is:

`/merchant/order/create`

then the action being performed is clearly the creation of an order. The code should mirror that structure as closely as possible.

The same idea applies to how variables, functions, initialisers, and synchronisers are organised. Their structure should follow the natural flow of the operation rather than introducing unnecessary abstractions.

The goal is simple: when a developer wants to do something with the API, the code should make that action immediately obvious.

This is ultimately the core purpose of the framework: **make the API easy to use and make common actions easy to understand.**

### 3. Predictable Error Handling

After the normal control flow comes error handling.

Things will inevitably go wrong—invalid requests, failed operations, business-rule violations, and other unexpected situations. The API should therefore return errors in a consistent and predictable format.

Errors should not introduce unnecessary complexity. A developer should be able to look at an error response and immediately understand what went wrong and, ideally, what needs to be fixed.

Consistent errors also make debugging easier. When every part of the API handles failures according to the same principles, developers do not have to learn a different error-handling system for every endpoint.

The principle is straightforward: **if something goes wrong, the API should make the problem clear rather than creating another problem for the developer to solve.**

These principles form the foundation of the framework. The objective is not to add complexity for its own sake, but to make the entire experience of working with the API simpler, more consistent, and more predictable.
