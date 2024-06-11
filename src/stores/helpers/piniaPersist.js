const piniaPersist = (paths = []) => {
    return {
        strategies: [{
            storage: localStorage,
            paths,
        }],
    };
};

export default piniaPersist;

// const piniaPersistConfig=(key, paths=[])=>{
// 	return {
// 		key,
// 		storage: localStorage,
// 		paths,
// 	};
// };
//
// export default  piniaPersistConfig;
