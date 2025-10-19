class Item {
  constructor(name, icon, description = "") {
    this.name = name;
    this.icon = icon;
    this.description = description;
  }
}

export default class ItemDictionary {
  static items = {
    pencil: new Item("Pencil", "✏️", "You need pencils to draft rooms with multiple doors"),
    eraser: new Item("Eraser", "🩹", "Use it to erase mistakes"),
    ruler: new Item("Ruler", "📏", "Sketch additional floor plan"),
    sheet: new Item("Answer Sheet", "📜", "Used to write your answers on, essential for exam submission"),
  };

  static get(itemId) {
    return ItemDictionary.items[itemId] || null;
  }
}
