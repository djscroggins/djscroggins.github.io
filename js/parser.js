var Parser = function () {
    var results = [];
    var newParser = {
        getChildren: function(dataIn, stringIn) {
            for (d in dataIn) {
                if (dataIn[d].name === stringIn && !dataIn[d].children) {
                    results.push([dataIn[d].name, dataIn[d].size]);
                } else if (dataIn[d].name === stringIn && dataIn[d].children) {
                    function getChildrenAux(childrenIn) {
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