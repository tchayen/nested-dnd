# nested-dnd

Proof of concept for doing a nested drag and drop in React. Features smooth,
animated drop and cancel.

---

### :construction: **WORK IN PROGRESS** :construction:

At the moment this serves more as a proof of concept (or example) rather than
a library-like thing.

---

Check out a [video](https://twitter.com/tczajecki/status/1122261807249412097) on
my Twitter.

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

## TODO

Putting it here so I won't forget.

- [x] get rid of example-specific magic numbers from `<Drag />`.
- [ ] fix bug with dropping outside of `<Drop />` sometimes being possible.
- [ ] extract some top level API components from `<App />`.
- [ ] maybe use indexes instead of made up IDs that are mostly indexes anyway.
- [ ] rethink naming of things in a way that keeps the cards analogy but isn't
      specific to it when not necessary.

## Installation

**tl;dr**: not yet.

The only way to have fun with it is cloning the repository.
