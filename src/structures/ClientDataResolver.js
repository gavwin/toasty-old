const { Constants } = require('discord.js');

class ClientDataResolver {
  /**
  * Resolves a ColorResolvable into a color number.
  * @param {ColorResolvable} color Color to resolve
  * @returns {number} A color
  */
  static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
      color = Constants.Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) {
      throw new RangeError('Color must be within the range 0 - 16777215 (0xFFFFFF).');
    } else if (color && isNaN(color)) {
      throw new TypeError('Unable to convert color to a number.');
    }

    return color;
  }

  /**
  * @param {ColorResolvable} color Color to resolve
  * @returns {number} A color
  */
  resolveColor(color) {
    return this.constructor.resolveColor(color);
  }
}

module.exports = ClientDataResolver;
