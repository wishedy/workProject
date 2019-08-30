const action = {
    firstTag:({commit, state},options)=>{
        state.stairId = options.id;
    },
    secondTag:({commit, state},options)=>{
        state.secondId = options.id;
    },
    scene:({commit, state},options)=>{
        state.sceneType = options.type;
    },
}

export default action