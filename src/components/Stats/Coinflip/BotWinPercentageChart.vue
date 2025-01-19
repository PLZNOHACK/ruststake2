<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "BotWinPercentageChart",
  components: { LineChart },
  props: {
    data: undefined,
  },
  data () {
    return {
      graphData: null,
      graphOptions: null,
    }
  },
  mounted () {
    let data = []
    for(let i = 0; i < this.data.botCount.length; i++) {
      data[i] = (this.data.botWins[i] / this.data.botCount[i]) * 100
    }

    let average = data.reduce((a, b) => a + b, 0) / data.length

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Win percentage',
          backgroundColor: '#00b1ff',
          borderColor: '#00b1ff',
          data: data,
          fill: false
        },
      ],
    }

    this.graphOptions = {
      responsive: true,
      radius: 5,
      interaction: {
        intersect: false
      },

      plugins: {
        title: {
          display: true,
          text: 'Coinflip bot (Average: ' + average.toFixed(2) + '%)',
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
