const f = new Function("a", "b", "return console.log(a * b)");
let result = f(10, 10);
console.log(result)