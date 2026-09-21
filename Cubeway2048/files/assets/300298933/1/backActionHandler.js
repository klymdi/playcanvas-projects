const backActionHandlerScript = document.createElement("script");
backActionHandlerScript.src = "https://megogo.games/utils/backActionHandler.js";
backActionHandlerScript.type = "text/javascript";
document.head.appendChild(backActionHandlerScript).addEventListener('load', event => {
    BackActionHandler.backAction = function () {
        //console.log('back action');
        if (typeof Main !== 'undefined' && Main.instance) {
            try {
                if (InterfaceNavigationPanel.stack.length !== 0) {
                    InterfaceNavigationPanel.closeLastPanel();
                }
                else if (UiFocusTutorial.instance.currentTut) {
                    UiFocusTutorial.instance.currentTut.entity.enabled = false;
                }
                else if (SceneManager.rootsList.length > 0 && SceneManager.rootsList[0].scene.name != "Menu") {
                    SceneManager.changeScene('Menu');
                }
                // else if(CheatsPanel.instance && CheatsPanel.instance.entity && CheatsPanel.instance.entity.enabled){
                //     CheatsPanel.instance.entity.enabled = false;
                // }
                else if (Main.instance.quitPanel) {
                    Main.instance.quitPanel.enabled = !Main.instance.quitPanel.enabled;
                }
            }
            catch (error) {
                console.error('Error when backAction, fallback to quit()\n', error);
                this.quit();
            }
        }
        else {
            this.quit();
        }
    }.bind(BackActionHandler);

    BackActionHandler.quit = function () {
        console.log('try quit');
        Megogo.quitMessage();
    }.bind(BackActionHandler);

    BackActionHandler.init();
});
