<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "CoinflipProfitChart",
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
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Daily Cases',
          backgroundColor: '#FF6384',
          data: this.data.dailycases,
          fill: true
        },
        {
          label: 'Level Rewards',
          backgroundColor: '#3689ff',
          data: this.data.levelrewards,
          fill: true
        },
        {
          label: 'Affiliates',
          backgroundColor: '#ffc863',
          data: this.data.affiliates,
          fill: true
        },
        {
          label: 'Airdrops',
          backgroundColor: '#63ffb9',
          data: this.data.airdrops,
          fill: true
        },
        {
          label: 'Free Gems',
          backgroundColor: '#e263ff',
          data: this.data.freegems,
          fill: true
        },
        {
          label: 'Christmas Calendar',
          backgroundColor: '#ff63a1',
          data: this.data.calendar,
          fill: true
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
      scales: {
        y: {
          stacked: true,
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Rewards',
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
