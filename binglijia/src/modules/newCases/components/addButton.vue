<template>
    <div class="addColumnBtn">
        <i></i><span v-text="labelName"></span>
    </div>
</template>
<script>
    export default {
        props:['labelName']
    }
</script>
