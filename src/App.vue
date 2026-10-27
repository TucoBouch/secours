<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'
import { direction } from './router'

const route = useRoute()
const showTabs = computed(() => !!route.meta.tabs)
</script>

<template>
  <div class="app" :class="{ 'has-tabs': showTabs }">
    <RouterView v-slot="{ Component, route: r }">
      <Transition :name="`page-${direction}`" mode="out-in">
        <component :is="Component" :key="r.path" />
      </Transition>
    </RouterView>
    <TabBar v-if="showTabs" />
  </div>
</template>
