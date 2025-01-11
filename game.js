export function calculateAisle(value) {
    const modulo = value % 100;
    if (modulo >= 1 && modulo <= 26) {
      return String.fromCharCode(64 + modulo); // ASCII: A=65, B=66, ...
    }
    return ""; 
  }