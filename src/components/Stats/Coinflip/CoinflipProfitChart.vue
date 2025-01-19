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
    let averageUsers = this.data.profit.reduce((a, b) => a + b, 0) / this.data.profit.length;
    let averageBot = this.data.botProfit.reduce((a, b) => a + b, 0) / this.data.botProfit.length;
    let averageInfluencers = this.data.influencerProfit.reduce((a, b) => a + b, 0) / this.data.influencerProfit.length;

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'User profit',
          backgroundColor: (averageUsers >= 0 ? '#41ff68' : '#FF6384'),
          data: this.data.profit,
          fill: true
        },
        {
          label: 'Bot profit',
          backgroundColor: (averageBot >= 0 ? '#80ff99' : '#f83c63'),
          data: this.data.botProfit,
          fill: true
        },
        {
          label: 'Influencer profit',
          backgroundColor: (averageInfluencers >= 0 ? '#b2ffc0' : '#cf1c4a'),
          data: this.data.influencerProfit,
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
          text: 'Coinflip profits (User average: $' + averageUsers.toFixed(2) + ', Bot average: $' + averageBot.toFixed(2) + ')',
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
