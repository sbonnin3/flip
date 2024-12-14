<template>
    <div class="statistiques-view">
      <h1>Statistiques des Vues</h1>
      <div class="navigation-container">
        <button @click="goBack" class="nav-button" :disabled="startIndex <= 0">
          ⬅ Précédent
        </button>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <button
          @click="goForward"
          class="nav-button"
          :disabled="startIndex + displayedDays >= totalDays"
        >
          Suivant ➡
        </button>
      </div>
      <div class="settings-container">
        <label for="days-select">Nombre de jours à afficher : </label>
        <select id="days-select" v-model="displayedDays" @change="handleDaysChange">
          <option v-for="days in daysOptions" :key="days" :value="days">
            {{ days }} jours
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  import { statistiques } from "../datasource/statistiques";
  
  Chart.register(...registerables);
  
  export default {
    name: "StatistiquesView",
    data() {
      return {
        chart: null,
        dailyViews: [], // Les données affichées initialement (seront réduites à `displayedDays`)
        startIndex: 0, // Index de départ pour afficher les jours
        displayedDays: 3, // Nombre de jours affichés au départ
        totalDays: statistiques.dailyViews.length, // Nombre total de jours disponibles
        daysOptions: [3, 4, 5, 6, 7, 8, 9, 10], // Options disponibles pour l'affichage
      };
    },
    methods: {
      goBack() {
        if (this.startIndex > 0) {
          this.startIndex -= 1;
          this.updateDisplayedViews();
        }
      },
      goForward() {
        if (this.startIndex + this.displayedDays < this.totalDays) {
          this.startIndex += 1;
          this.updateDisplayedViews();
        }
      },
      handleDaysChange() {
        if (this.startIndex + this.displayedDays > this.totalDays) {
          this.startIndex = Math.max(0, this.totalDays - this.displayedDays);
        }
        this.updateDisplayedViews();
      },
      updateDisplayedViews() {
        // Limiter l'affichage aux données visibles
        this.dailyViews = statistiques.dailyViews.slice(
          this.startIndex,
          this.startIndex + this.displayedDays
        );
        this.updateChart();
      },
      initializeChart() {
        const ctx = this.$refs.chartCanvas.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: this.dailyViews.map((view) => `${view.day} (${view.date})`),
            datasets: [
              {
                label: "Vues par jour",
                backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#03a9f4", "#ff5722"],
                borderColor: ["#388e3c", "#1976d2", "#f57c00", "#d32f2f", "#7b1fa2", "#0288d1", "#e64a19"],
                borderWidth: 1,
                data: this.dailyViews.map((view) => view.views),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 50,
                },
              },
            },
          },
        });
      },
      updateChart() {
        this.chart.data.labels = this.dailyViews.map(
          (view) => `${view.day} (${view.date})`
        );
        this.chart.data.datasets[0].data = this.dailyViews.map(
          (view) => view.views
        );
        this.chart.update();
      },
    },
    mounted() {
      // Initialiser les données avec seulement les 3 derniers jours
      this.startIndex = this.totalDays - this.displayedDays;
      this.dailyViews = statistiques.dailyViews.slice(
        this.startIndex,
        this.startIndex + this.displayedDays
      );
      this.initializeChart();
    },
  };
  </script>
  
  <style scoped>
  .statistiques-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 20px;
  }
  
  h1 {
    font-family: Arial, sans-serif;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .navigation-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .settings-container {
    margin-top: 20px;
  }
  
  .settings-container select {
    padding: 5px;
    font-size: 14px;
  }
  
  .nav-button {
    background-color: #1976d2;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .nav-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .nav-button:hover:enabled {
    background-color: #1565c0;
  }
  
  .chart-container {
    width: 80%;
    max-width: 600px;
    height: 400px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  </style>
  