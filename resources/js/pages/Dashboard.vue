<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div class="py-12">
                <div class="grid grid-cols-1 bg-gray-100">
                    <inertia-link href="/peg" class="p-4 rounded-lg  shadow hover:shadow-lg transition">
                        <h2 class="text-xl font-semibold text-center">Dashboard</h2>
                    </inertia-link>
                </div>
            </div>
        </div>
    </AppLayout>

    </template>
