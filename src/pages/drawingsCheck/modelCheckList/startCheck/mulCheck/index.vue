<template>
  <div>
    <SelectCheckPoint ref="SelectCheckPoint"></SelectCheckPoint>
  </div>
</template>

<script>
import SelectCheckPoint from '../selectCheckPoint.vue';

export default {
    props: {
        models: {
            type: Array,
            default: () => []
        }
    },
    components: { SelectCheckPoint },
    methods: {
      getData () {
        return {
          selectedCheckpoints: this.$refs.SelectCheckPoint.selectedCheckpoints
        }
      }
    }
}
</script>

<style>

</style>
