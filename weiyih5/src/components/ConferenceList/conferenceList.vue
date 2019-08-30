<template>
    <section class="meetingList ev-meetingList" data-alcode-mod='674'>
        <p class="results ev-aListNum" v-if="parseInt(totalNum)">已为您找到{{totalNum}}个会议</p>
        <ul>
            <li v-for="(items,index) in conListArr" :key="index">
                <p class="meetingLive" v-if="items.isLive&&parseInt(items.isLive)===1"></p>
                <aside class="meetingTitle">
                    <span v-if="items.conTag">{{items.conTag}}</span>
                    <a :href="'/dist/conference/meeting_detail.html?conId='+items.conId"
                       class="ev-meetingName">{{items.conName}}</a>
                </aside>
                <aside class="meetingTime">
                    <p class="mTime" v-if="items.conTime">{{items.conTime}}</p>
                    <p class="mAddress" v-if="items.conAddr">{{items.conAddr}}</p>
                </aside>
            </li>
        </ul>
    </section>
</template>

<script>
    export default {
        props:['conListArr','totalNum']
    }
</script>
