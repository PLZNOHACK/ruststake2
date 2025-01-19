<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';


Chart.register(...registerables, zoomPlugin);

export default {
  name: "AffiliateChart1",
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
    this.graphData = {

      labels: this.data.entries.map(entry => {
        return (new Date(entry)).toLocaleDateString("en-US");
      }),

      datasets: [
        {
          type: 'line',
          label: 'Total Used',
          tension: 0.4,
          borderColor: '#a4e654',
          backgroundColor: '#87bc45',
          data: this.data.total_used
        },
        {
          type: 'line',
          label: 'Total Depositors',
          tension: 0.4,
          borderColor: '#fdd149',
          backgroundColor: '#edbf33',
          data: this.data.total_depositors
        }
      ],
    }

    this.graphOptions = {
      responsive: true,
      radius: 5,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      plugins: {
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
