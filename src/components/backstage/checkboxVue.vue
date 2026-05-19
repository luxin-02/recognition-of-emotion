<template>
    <div>
        <input type="checkbox" v-model="value" />
    </div>
</template>
  
<script>
export default {
    model: {
        prop: 'propsValue',
        event: 'returnValue'
    },
    props: {
        propsValue: {
            type: Boolean,
            default: () => {
                return false;
            },
        },
    },
    data() {
        return {
            value: false,
        };
    },
    watch: {
        propsValue(newPropsValue) {
            this.value = newPropsValue;
        },
        value(newValue) {
            this.$emit("returnValue", newValue);
        },
    },
};
</script>
  
<style lang="less" scoped>
div {
    width: 18px;
    height: 18px;

    >input {
        display: block;
        width: 18px;
        height: 18px;
        background: #eeeeee;
        border: 1px solid #b5b5b5;
        border-radius: 4px;
        -webkit-appearance: none;
        cursor: pointer;

        &:hover {
            border: 1px solid #1890ff;
        }

        &:checked {
            background: #1890ff;
            background-size: 0.18rem 0.18rem;
            border: 1px solid #1890ff;
            position: relative;

            &::after {
                content: "";
                display: block;
                width: 0.12rem;
                height: 0.12rem;
                background: url("@/assets/img/backstage/checked.png") center center;
                background-size: 0.12rem 0.12rem;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 25;
            }

            border-radius: 4px;
        }
    }
}
</style>