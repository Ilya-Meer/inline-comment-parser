/// This is a comment at
/// the beginning of the file
class DummyClass {
  constructor(name) {
    /// Here's a comment
    /// that won't be accompanied
    /// by any identifier information
    this.name = name;
  }

  /// This here's a method
  greet(style) {
    if (style === 'loud') {
      return `Hi, ${this.name}!`.toUpperCase();
    }

    return `Hi, ${this.name}!`;
  }
}
