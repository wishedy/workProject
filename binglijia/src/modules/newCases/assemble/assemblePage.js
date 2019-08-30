import Vue from 'vue';
import InputBar from '../components/InputBar.vue';
import RadioBar from '../components/radioboxBar.vue';
import SelectInput from '../components/selectInput.vue';
import InputSelect from '../components/inputSelect.vue';
import SelectBar from '../components/selectBar.vue';
import DatePicker from '../components/datePicker.vue';
import CheckboxBar from '../components/checkboxBar.vue';
import TextAreaBar from '../components/textAreaBar.vue';
import AgeInput from '../components/ageInput.vue';
import AddButton from '../components/addButton.vue';
import TagList from '../components/tagList.vue';
import UpLoadFile from '../components/upLoadFile.vue';
import store from "../store/store.js";
import {mapGetters,mapActions} from 'vuex';
import TemplatePage from './templatePage.js';
//新建病历的所有动态页面 全部在这里组装出来最后返回给需要的页面一个vue对象，挂在到页面的某个元素中
class assemblePage {
    constructor(props){
        let assemblePageObj = this;
        assemblePageObj.subIndex = props.templateIndex;
        assemblePageObj.pageConfigData = JSON.parse(JSON.stringify(props.data[props.templateIndex]));
        ////console.log(assemblePageObj.pageConfigData);
        this.template = new TemplatePage(assemblePageObj.pageConfigData).createPageHtml();
    }
    createPage(){
        let assemblePageObj = this;
        return new Vue({
            store,
            template:`<aside id="assemble">${assemblePageObj.template}</aside>`,
            data(){
                return{
                    illDurationTimeSelect:false,
                    illDurationTimeFocus:false
                }
            },
            computed:{
              ...mapGetters(['titleName'])
            },
            methods:{
                ...mapActions(['savePageData','changeSubIndex','changeAssemblePage']),
                toggleSelect(){
                    ////console.log('点击');
                }
            },
            beforeMount(){
                //console.log('加载了数据');
                let vueObj = this;
                vueObj.changeAssemblePage(false);
                vueObj.savePageData(assemblePageObj.pageConfigData);
                vueObj.changeSubIndex({set:true,index:assemblePageObj.subIndex});
            },
            mounted(){
                let vueObj = this;
                vueObj.changeAssemblePage(true);
            },
            components:{
                InputBar,
                RadioBar,
                SelectInput,
                SelectBar,
                InputSelect,
                DatePicker,
                TextAreaBar,
                AgeInput,
                CheckboxBar,
                AddButton,
                TagList,
                UpLoadFile
            }
        })
    }
}
export default assemblePage;
