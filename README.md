# nested-dnd

Proof of concept for doing a nested drag and drop in React. Features smooth,
animated drop and cancel.

---

### :construction: **WORK IN PROGRESS** :construction:

At the moment this serves more as a proof of concept (or example) rather than
a library-like thing.

---

<p align="center"><img src="screenshot.png"></p>

## Features

- Allows you to drag a part of the stack with the items lying on top of the
  dragged one.
- Drop it on top of any other stack so the elements will smoothly migrate there.
- Drop it anywhere so the elements smoothly go back to their place.

## How it works?

- The overlaying of the cards relies on CSS transforms.
- Animations are triggered
  in JS via `element.animate(...)` API.
- The element currently being dragged always stays on top with use of `:focus`.
- Stack is a recursive component.
- Drop zones are registered and passed using context API.
- Changing parent stack uses waaaay too much logic bound to this example.

## Installation

**tl;dr**: not yet.

The only way to have fun with it is cloning the repository.
