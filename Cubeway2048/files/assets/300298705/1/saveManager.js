const SaveManager = {
    gameName:'CoreChain',
    data:{
        money: 0,
        totalRatingScore: 0,
        nickname: 'Guest_125480',
        noAds: false,
        localeTutor: false,
        menuTutorial1: false,
        shopTutorial: false,
        arcadeTutorial: false,
        leaderboardTutorial: false,
        gameTutorial: false,
        locale: '',
        ownedSkins: ['DEFAULT'],      
        selectedSkin: 'DEFAULT',   
        progress: {
            stages: {}
        }
    },
    /**@type {pc.AppBase} */
    app:null,
    /**@type {pc.EventHandle} */
    saveEventHandle:null,

    initialize() {
        if(typeof pc != 'undefined') {
            this.app = pc.Application.getApplication();
            console.log('[0] SaveManager set app', this.app);
        }
        if(this.app == null)
        {
            window.addEventListener("load", ()=> {
                this.app = pc.Application.getApplication();
                console.log('[1] SaveManager set app', this.app);
            });
        }
        
        if(this.gameName.length === 0){
            this.gameName = window.location.pathname;
            console.warn(`saveName not set in SaveManager, change to ${this.gameName}`);
        }
        //
        this.saveEventHadnler = null;
        this.load();
    },
    
    save(){
        if(this.saveEventHandle !== null) return;

        if(this.app !== null)
        {
            this.saveEventHandle = this.app.once('update', this.instantSave, this);
        }
        else {
            this.instantSave();
        }
    },

    instantSave()
    {
        if(this.saveEventHandle !== null){
            this.saveEventHandle = null;
        }
        localStorage.setItem(this.gameName, JSON.stringify(this.data));
    },
    load(){
        var jsonStr = localStorage.getItem(this.gameName);
        if (jsonStr === null) return;
        var loadData = JSON.parse(jsonStr);
        //Object.assign(this.data, loadData);
        this.data = mergeDeep(this.data, loadData);
        console.log('data', this.data);
    },
    addMoney(addValue){
        this.data.money += addValue;
        Main.instance.moneyText.element.text = this.data.money.formatScore();
        Main.instance.moneyUi.script.coinAnim.start();
        this.save();
    },
}


/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {    
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) { 
          Object.assign(target, { [key]: {} });
        }else{          
          target[key] = Object.assign({}, target[key])
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

SaveManager.initialize();