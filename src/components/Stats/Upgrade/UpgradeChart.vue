<template>
  <BarChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "UpgradeChart",
  components: { BarChart },
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
          label: 'Real Volume',
          backgroundColor: 'rgb(54, 162, 235)',
          data: this.data.volume
        },
        {
          label: 'Influencer Volume',
          backgroundColor: 'rgb(233,137,255)',
          data: this.data.influencerVolume
        }
      ],
    }

    this.graphOptions = {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Upgrade volume',
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
