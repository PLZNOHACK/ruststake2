<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "JackpotProfitChart",
  components: { LineChart },
  props: {
    data: undefined,
    gamemode: undefined,
  },
  data () {
    return {
      graphData: null,
      graphOptions: null,
    }
  },
  mounted () {
    let average = this.data.profit.reduce((a, b) => a + b, 0) / this.data.profit.length;

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Real Profit',
          backgroundColor: (average >= 0 ? '#41ff68' : '#FF6384'),
          data: this.data.profit,
          fill: true
        }
      ]
    }

    this.graphOptions = {
      responsive: true,
      radius: 5,
      interaction: {
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: this.gamemode + ' profits (Average: $' + average.toFixed(2) + ')',
        },
        zoom: {
          // limits: {
          //   x: {min: 0, max: 9},
          // },
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
