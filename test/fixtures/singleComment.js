class DummyClass {
  /// This is a single comment
  /// Documenting the constructor
  /// With some useful information
  constructor(name) {
    this.name = name;
  }

  greet(style) {
    if (style === 'loud') {
      return `Hi, ${this.name}!`.toUpperCase();
    }

    return `Hi, ${this.name}!`;
  }
}
