<template>
  <BarChart v-if="graphData !== null" :chartData="graphData" :options="graphOptions" />
</template>

<script>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

export default {
  name: "ProfitChart",
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
    let totalDeposited = this.data.crypto.reduce((a, b) => a + b, 0)
      + this.data.card.reduce((a, b) => a + b, 0)
      + this.data.giftcard.reduce((a, b) => a + b, 0)
    let totalWithdrawn = this.data.cryptoSale.reduce((a, b) => a + b, 0)

    let average = (totalDeposited - totalWithdrawn) / this.data.dates.length

    let profit = this.data.crypto.map((cryptoDeposit, index) => {
      return cryptoDeposit + this.data.card[index] + this.data.giftcard[index] - this.data.cryptoSale[index]
    })

    this.graphData = {
      labels: this.data.dates.map(date => new Date(date).toLocaleDateString("en-US")),
      datasets: [
        {
          label: 'Profit',
          backgroundColor: profit.map(p => p > 0 ? '#41ff68' : '#ff4141'),
          data: profit,
          fill: true,
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
