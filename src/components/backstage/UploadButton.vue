<template>
    <el-upload class="up_button_warp" :auto-upload="false" :action="''" :accept="accept" :on-change="change"
        :show-file-list="false">
        <div class="up_button" @click="">
            <slot></slot>
        </div>
    </el-upload>
</template>

<script>
export default {
    props: {
        accept: {

        }
    },
    data() {
        return {
        }
    }, methods: {

        change(file, fileList) {
            this.$emit('change', file)
        },
    },
}

</script>
<style lang="less" scoped>
.up_button_warp {
    display: flex;
}

.up_button {

    background: #2e8ae6;
    border-radius: 6px;

    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    padding: 11px 18px;

    line-height: 16px;
    position: relative;

    .core_button {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

    }

}
</style>
