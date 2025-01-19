<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "TaxChart",
  components: { LineChart },
  props: {
    data: undefined,
    gamemode: {type: String, required: true},
    type: {type: String, required: true}
  },
  data () {
    return {
      graphData: null,
      graphOptions: null,
    }
  },
  mounted () {
    let average = this.data[this.type].reduce((a, b) => a + b, 0) / this.data[this.type].length

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Average Tax',
          backgroundColor: '#00b1ff',
          borderColor: '#00b1ff',
          data: this.data[this.type],
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
          text: `${this.gamemode} average tax: ${average.toFixed(2)}%`
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
