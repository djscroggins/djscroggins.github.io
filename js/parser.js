var Parser = function () {
    var results = [];
    var newParser = {
        getChildren: function(dataIn, stringIn) {
            console.log("Called getChildren");
//    var results = [];
            for (d in dataIn) {
                console.log(dataIn[d].name);
                if (dataIn[d].name === stringIn && !dataIn[d].children) {
//            var leaf = [];
                    console.log("Found it in first if!");
                    console.log(dataIn[d].size);
                    results.push([dataIn[d].name, dataIn[d].size]);
//            return leaf;
                } else if (dataIn[d].name === stringIn && dataIn[d].children) {
                    console.log("Found it in second else if!");
                    function getChildrenAux(childrenIn) {
                        console.log("Called get Children Aux");
                        for (c in childrenIn){
                            if (childrenIn[c].children) {
                                getChildrenAux(childrenIn[c].children)
                            } else {
                                console.log(childrenIn[c].size);
                                results.push([childrenIn[c].name, childrenIn[c].size]);
                            }
                        }
                    }
                    getChildrenAux(dataIn[d].children);
//            break;
                } else if (dataIn[d].name !== stringIn && dataIn[d].children ) {
                    console.log("Still going!");
                    this.getChildren(dataIn[d].children, stringIn);
                }
            }
            return results;
        },
        resetResults: function () {
            results = [];
        }
    };
    return newParser;
};