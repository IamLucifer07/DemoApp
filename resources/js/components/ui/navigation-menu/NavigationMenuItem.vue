<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuItem, type NavigationMenuItemProps } from 'reka-ui'

const props = defineProps<NavigationMenuItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  
</template>
