# marisuto-drop-probability
marisuto-drop-probability is the application which calculates and shows the chance to get your desired character or item in [Marisa and Alice's cookie storia](http://sitappa.com/).
To use this application, visit [GitHub Pages of this repository](http://babylon114514.github.io/marisuto-drop-probability/).

## Note
Data is not always latest because the database used by this application is manually updated by [@babylon114514](https://github.com/babylon114514).

## How to build
You can edit database and build the application which uses your own database.
To build, Node.js (^5.5.0) is required.

```bash
git clone https://github.com/babylon114514/marisuto-drop-probability.git
cd marisuto-drop-probability
npm install
vi src/difficulty.js # edit database if you need
npm run build
```

To run the application, simply open `index.html`.

## License
marisuto-drop-probability is licensed under [Unlicense](http://unlicense.org/).
Because Unlicense is almost the same as public domain, you can publish your own version of marisuto-drop-probability with no limitation.
