<template>
  <LineChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "TransactionsChart",
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
    let totalDeposited = this.data.deposited.reduce((a, b) => a + b, 0)
      + this.data.crypto.reduce((a, b) => a + b, 0)
      + this.data.skinswap.reduce((a, b) => a + b, 0)
    let totalWithdrawn = this.data.withdrawn.reduce((a, b) => a + b, 0)
      + this.data.cryptoSale.reduce((a, b) => a + b, 0)

    let average = (totalDeposited - totalWithdrawn) / this.data.dates.length

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Crypto',
          borderColor: 'rgba(60, 163, 248, 1)',
          backgroundColor: 'rgba(60, 163, 248, 1)',
          data: this.data.crypto,
          fill: false,
          stack: 1,
        },
        {
          label: 'Card',
          borderColor: 'rgb(223,65,255)',
          backgroundColor: 'rgb(223,65,255)',
          data: this.data.card,
          fill: false,
          stack: 1,
        },
        {
          label: 'Giftcard',
          borderColor: 'rgb(65,255,204)',
          backgroundColor: 'rgb(65,255,204)',
          data: this.data.giftcard,
          fill: false,
          stack: 1,
        },
        {
          label: 'Crypto Withdraw',
          borderColor: 'rgba(168, 182, 174, 1)',
          backgroundColor: 'rgba(168, 182, 174, 1)',
          data: this.data.cryptoSale,
          fill: false,
          stack: 2,
        },
        {
          label: 'Skinswap',
          borderColor: 'rgba(248, 167, 60, 1)',
          backgroundColor: 'rgba(248, 167, 60, 1)',
          data: this.data.skinswap,
          fill: false,
          stack: 1,
        },
        {
          label: 'Deposited',
          borderColor: '#41ff68',
          backgroundColor: 'rgba(65, 255, 104, 1)',
          data: this.data.deposited,
          fill: false,
          stack: 1
        },
        {
          label: 'Withdrawn',
          borderColor: '#f83c63',
          backgroundColor: 'rgba(248, 60, 99, 1)',
          data: this.data.withdrawn,
          fill: false,
          stack: 2
        },
      ],
    }

    this.graphOptions = {
      radius: 5,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        yAxes: {
          stacked: true,
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Average profit: $${average.toFixed(2)}`
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
