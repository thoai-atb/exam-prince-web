class Item {
  constructor(name, icon, description = "") {
    this.name = name;
    this.icon = icon;
    this.description = description;
  }
}

export default class ItemDictionary {
  static items = {
    pencil: new Item("Pencil", "✏️", "Draft rooms with multiple doors"),
    eraser: new Item("Eraser", "🩹", "Used to erase mistakes, cannot be used for previus rooms"),
    ruler: new Item("Ruler", "📏", "Sketch an additional floor plan"),
    sheet: new Item("Answer Sheet", "📜", "This item is required for exam submission"),
  };

  static get(itemId) {
    return ItemDictionary.items[itemId] || null;
  }
}
