// prints 10, 10 times once per second
// the global scope of var is what ruins this
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000)
}

// prints 1, 2, 3...
// let has block scope so it works just fine
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000)
}

// prints 1, 2, 3...
// const overwrites the var and keeps it consistent within its own scope
for (var i = 0; i < 10; i++) {
  const current = i;
  setTimeout(() => {
    console.log(current);
  }, current * 1000)
}

// prints 1, 2, 3...
for (var i = 0; i < 10; i++) {
  function makePrinter(current) {
    //inner scope start
    return function() {
      // inner scope end
      console.log(current);
    }
    // makePrinter scope end
  }
  setTimeout(makePrinter(i), i * 1000);
}