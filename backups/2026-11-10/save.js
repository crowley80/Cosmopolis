const Save = {
  key: "cosmopolis_save",

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  load() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  },

  exists() {
    return localStorage.getItem(this.key) !== null;
  }
};

window.Save = Save;
