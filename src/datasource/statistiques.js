
// JSON comtenant les données des statistiques

export const statistiques = {
  dailyViews: [],

  initializeData() {
    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9);

    for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
      const dayName = daysOfWeek[date.getDay()];
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const views = Math.floor(Math.random() * 200 + 100);

      this.dailyViews.push({
        day: dayName,
        date: formattedDate,
        views: views,
      });
    }
  },

  updateViews() {
    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const today = new Date();

    const dayName = daysOfWeek[today.getDay()];
    const formattedDate = today.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const newViews = Math.floor(Math.random() * 200 + 100);

    const lastIndex = this.dailyViews.length - 1;
    this.dailyViews[lastIndex] = { day: dayName, date: formattedDate, views: newViews };
  },
};

statistiques.initializeData();