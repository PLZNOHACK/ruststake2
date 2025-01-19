<template>
  <div class="snapshot">
    <div class="snapshotDate">{{new Date(snapshot.date).toLocaleDateString("en-US")}}:</div>
    <div class="snapshotValues">
      <div class="snapshotValue">${{parseFloat(snapshot[value]).toFixed(2)}}</div>
      <div v-if="(snapshots.indexOf(snapshot) + 1) < snapshots.length" class="snapshotDifference"
           :style="(parseFloat(snapshots[snapshots.indexOf(snapshot) + 1][value]) > parseFloat(snapshot[value]) ? 'color: rgba(255, 83, 83, 0.9);' : 'color: rgba(121, 255, 121, 0.9);')">
        ({{parseFloat(snapshots[snapshots.indexOf(snapshot) + 1][value]) > parseFloat(snapshot[value]) ? '-' : '+'}}${{Math.abs(parseFloat(snapshot[value]) - parseFloat(snapshots[snapshots.indexOf(snapshot) + 1][value])).toFixed(2)}})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Snapshot",
  props: {
    snapshot: Object,
    snapshots: Array,
    value: String,
  }
}
</script>

<style scoped>
.snapshot {
  display: flex;
  flex-direction: row;
  background: #1E242B;
  border-radius: 12px;
  min-height: 5vh;
  align-items: center;
  justify-content: center;
  margin: 0.3em 0;
}

.snapshotDate {
  margin-right: 0.4em;
}

.snapshotValues {
  display: flex;
  flex-direction: row;
}

.snapshotValue {
  margin-right: 0.4em;
  font-weight: bolder;
}

.snapshotDifference {
  font-weight: bolder;
}
</style>