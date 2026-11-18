const Character = {
  create(data) {
    const character = {
      name: data.name || "Sin nombre",
      nature: data.nature || "",
      appearance: data.appearance || "",
      history: data.history || "",
      abilities: data.abilities || "",
      personality: data.personality || "",
      createdAt: new Date().toISOString()
    };

    Save.save({ character });
    return character;
  }
};

window.Character = Character;
