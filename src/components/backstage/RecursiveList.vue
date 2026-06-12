<!--@ 
    无限递归组件配合插槽

-->
<template>
    <ul>
        <li v-for="(item, i) in  items " :key="item.id + '_i'">
            <slot :item="{ ...item, level }"></slot>
            <recursive-list :level="level + 1" :items="item.children" v-if="item.children">
                <template v-slot="row">
                    <slot :item="{ ...row.item }"></slot>
                </template>

            </recursive-list>
        </li>
    </ul>
</template>
  
<script>
export default {
    name: 'RecursiveList',
    props: {
        items: {
            type: Array,
            required: true,
            default: () => {
                return []
            },

        },
        level: {
            type: Number,
            default: 0
        }
    }
}
</script>
  