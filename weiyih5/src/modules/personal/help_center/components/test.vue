<template>
    <section>
        <section
                style="width: 300px;height: 200px;background: #f6c843;color: #333;font-weight: 600;font-size:30px;text-align: center;line-height: 200px;"
                @click="check">测试活动app方法
        </section>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';

    export default {
        methods: {
            check() {
                let _params = comm.getpara();
                appjs && appjs.publishActivityTimeLine(JSON.stringify({
                    "movementActivityName": _params['movementActivityName'] ? _params['movementActivityName'] : "测试活动2",
                    "movementActivityId": _params['movementActivityId'] ? _params['movementActivityId'] : "1543283861526"
                }));
            }
        }
    }
</script>