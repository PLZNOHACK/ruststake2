<template>
  <BarChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "BattleChart",
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
          label: 'Real volume',
          backgroundColor: 'rgb(54, 162, 235)',
          data: this.data.volume
        },
        {
          label: 'Bot volume',
          backgroundColor: 'rgb(225,169,49)',
          data: this.data.botVolume
        },
        {
          label: 'Influencer volume',
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
          text: 'Battle volume',
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
