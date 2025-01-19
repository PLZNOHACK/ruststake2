<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';


Chart.register(...registerables, zoomPlugin);

export default {
  name: "AffiliateChart2",
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
          label: 'Total Deposited',
          tension: 0.4,
          borderColor: '#ff7768',
          backgroundColor: '#ea5545',
          data: this.data.total_deposited
        },
        {
          type: 'line',
          label: 'Total Wagered',
          tension: 0.4,
          borderColor: '#ffc64c',
          backgroundColor: '#ffa600',
          data: this.data.total_wagered
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
