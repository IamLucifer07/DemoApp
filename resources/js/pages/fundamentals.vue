<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import EPS from '@/components/EPS.vue';

import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'fundamentals',
        href: '/fundamentals',
    },
];
</script>
<template>
    <Head title="fundamentals" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <h1 class="mb-6 text-2xl font-bold">Profitability</h1>

            <EPS />
        </div>
    </AppLayout>
</template>