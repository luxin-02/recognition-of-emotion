export default {
    computed: {
        scale() {
            return this.currentFontSize / 100;
        },
    },
    mounted() {
        window.addEventListener("resize", this.resizeChart);
        const newFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        this.currentFontSize = newFontSize;
    },
    data() {
        return {
            currentFontSize: 0,
        }
    },
    methods: {
        resizeChart() {

            setTimeout(() => {

                const newFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                this.currentFontSize = newFontSize;
            }, 100)
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeChart)
    }
}