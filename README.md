
L'artiste Springboard template
==============================
for HTML5 canvas development using Grant Skinner's CreateJS suite
-----------------------------------------------------------------

--> [Springboard](https://github.com/soulwire/Springboard)  
--> [CreateJS](https://github.com/CreateJS) 
--> [AtelierJS](https://github.com/bloomingbridges/AtelierJS)

### Summary

L'artiste is a minimal, production-ready template for HTML5 canvas development that comes with an aspect-ratio agnostic, vertically-ruled, centric layout and Grant Skinner's set of CreateJS libraries out of the box.

### What does that even mean? 

The template's layout is kept very basic and directs the focus to the centered canvas element, which comes with a little description tag attached (very exhibition-like) and is intended for quick mockups/experiments. 

It uses typography as its grid (vertical rhythm) and - should you decide to work with the included LESS file - the dimensions of the canvas (based on width and aspect-ratio) as well as the position of the content below will be automatically calculated for you on build. The visible grid is only for orientation and will be ignored during the build process as seen below:

__Before..__

![Before build](http://dl.dropbox.com/u/998319/linked/artiste_before.png)

__and After the build process:__

![After build](http://dl.dropbox.com/u/998319/linked/artiste_after.png)

### What is still missing?

* A comprehensive example for preloading and playing back sounds
* Go full-screen button for browsers that support the Fullscreen API
* More checks for browser support in general

### The specifics

Includes _EaselJS_ 0.4.2, plus _PxLoader_ 0.1 for asset preloading (will eventually be replaced with _PreloadJS_) plus a first version of _AtelierJS_.
Optional: _jQuery_ 1.6.2, _SoundJS_ 0.2, _TweenJS_ 0.2.
