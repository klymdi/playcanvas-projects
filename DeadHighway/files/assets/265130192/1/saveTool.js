const SaveTool = {
    savePrefix: 'Game_Dead_Highway', //must be unique prefix for each project
    /**@param {string} key*/
    getItem(key, defaultValue = null) {
        if (typeof localStorage === 'undefined') {
            console.error("[saveTool] [getItem] localStorage is not supported.");
            return defaultValue;
        }
        if(this.savePrefix.length === 0){
            console.error("[saveTool] [getItem] savePrefix is empty. (defaultValues in use)");
            return defaultValue;
        }
        try {
            const result = localStorage.getItem(this.savePrefix + key);
            if (result === null) return defaultValue;
            return JSON.parse(result);
        } catch (error) {
            console.error("Error getting item from localStorage", error);
            return defaultValue;
        }
    },
    /**@param {string} key
     * @param {Object} value*/
    setItem(key, value) {
        if (typeof localStorage === 'undefined') {
            console.error("[saveTool] [setItem] localStorage is not supported.");
            return;
        }
        if(this.savePrefix.length === 0){
            console.error("[saveTool] [getItem] savePrefix is empty.");
            return;
        }
        try {
            localStorage.setItem(this.savePrefix + key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting item to localStorage", error);
        }
    }
};