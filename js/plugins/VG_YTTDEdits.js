/*:
* @plugindesc Edits to plugin functions.
* @author vgperson
*/

/* Auto-Adjust Pauses at Start of Message */

// Automatically fixes messages so they start with a "\." if they need a short pause (not necessary when there's a textbox opening animation), and vice versa.
Window_Message.prototype.startMessage = function() {
	this.delayTime = Galv.MSE.delay;
	
	this.updateTargetCharacterId();
	this.loadWindowskin();
	this.width = this.windowWidth();
	
	this._textState = {};
	this._textState.index = 0;
	this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
	
	if (this._textState.text.trim() !== "") {
		var text = this._textState.text.trim();
		var mayNeedAdjustment = 0;
		
		if (this.openness == 0 && text.includes("\x1b.")) { // Has opening delay, so there shouldn't be a \. - if there is, it should be removed provided it's at start
			mayNeedAdjustment = -1;
		}
		else if (this.openness > 0&& !text.startsWith("\x1b>")) { // Has no opening delay, so make sure there's a \. at start (unless it should type instantly)
			mayNeedAdjustment = 1;
		}
		
		if (mayNeedAdjustment != 0) {
			if (!text.startsWith("\x1b.") && !text.startsWith("\x1b>")) { // If pause or instant-type is not already identifiable at start, remove all other escape codes to determine whether there is or isn't one
				text = text.replace(/\x1bC\[(\d+)\]/gi, "");
				text = text.replace(/\x1bI\[(\d+)\]/gi, "");
				text = text.replace(/\x1b!/gi, "");
				text = text.replace(/\x1b</gi, "");
				text = text.replace(/\x1bN/gi, "");
				text = text.replace(/\x1b\|/gi, "");
				text = text.replace(/\x1b\^/gi, "");
				text = text.replace(/\x1b\{/gi, "");
				text = text.replace(/\x1b\}/gi, "");
				text = text.replace(/\x1b\$/gi, "");
				text = text.replace(/\x1b\#/gi, "");
				text = text.replace(/\x1bsp\[(\d+)\]/gi, "");
				text = text.replace(/\x1bsw\[(\d+)\]/gi, "");
				text = text.replace(/\x1bse\[([^\]]*)\]/gi, "");
				text = text.replace(/\x1bfs\[(\d+)\]/gi, "");
				text = text.replace(/\x1bat\[(\d+)\]/gi, "");
			}
			
			if (mayNeedAdjustment == 1 && !text.startsWith("\x1b.") && !text.startsWith("\x1b>")) { // No starting pause when there should be one, and doesn't start with \>
				this._textState.text = "\x1b." + this._textState.text;
			}
			else if (mayNeedAdjustment == -1 && text.startsWith("\x1b.")) { // Starting pause when there shouldn't be one
				this._textState.text = this._textState.text.replace("\x1b.", "");
			}
		}
	}
	
	this.newPage(this._textState);
	this.updatePlacement();
	this.updateBackground();
	this.open();
	
	this.resetLayout();
};



/* Convenience and Compatibility */

if (typeof $modifiedTestPlay !== "undefined" && $modifiedTestPlay) {
	// Change skip button to Page Down.
	utakata.MessageSkip.isPressedMsgSkipButton = function() {
		if (Utils.isOptionValid('test'))
			this._skipKey = "pagedown";
		return Input.isPressed(this._skipKey);
	};
	
	// Disable Print Screen screenshot function.
	SceneManager.onKeyUpForCapture = function() { };
}

// Add prefix to local storage save files to prevnt overlap.
if (typeof $useStoragePrefix !== "undefined" && $useStoragePrefix) {
	StorageManager.webStorageKey = function(savefileId) {
		if (savefileId < 0) {
			return 'Shine RPG Config';
		} else if (savefileId === 0) {
			return 'Shine RPG Global';
		} else {
			return 'Shine RPG File%1'.format(savefileId);
		}
	};
}

// Add dataFolder prefix for resource files.
if (typeof $useDataFolder !== "undefined" && $useDataFolder) {
	DataManager.loadDataFile = function(name, src) {
		var xhr = new XMLHttpRequest();
		var url = $dataFolder + 'data/' + src;
		xhr.open('GET', url);
		xhr.overrideMimeType('application/json');
		xhr.onload = function() {
			if (xhr.status < 400) {
				window[name] = JSON.parse(xhr.responseText);
				DataManager.onLoad(window[name]);
			}
		};
		xhr.onerror = this._mapLoader || function() {
			DataManager._errorUrl = DataManager._errorUrl || url;
		};
		window[name] = null;
		xhr.send();
	};
	
	DataManager.loadMapData = function(mapId) {
		if (mapId > 0) {
			var filename = 'Map%1.json'.format(mapId.padZero(3));
			this._mapLoader = ResourceHandler.createLoader($dataFolder + 'data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
			this.loadDataFile('$dataMap', filename);
		} else {
			this.makeEmptyMap();
		}
	};
	
	ImageManager.loadAnimation = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/animations/', filename, hue, true);
	};

	ImageManager.loadBattleback1 = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/battlebacks1/', filename, hue, true);
	};

	ImageManager.loadBattleback2 = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/battlebacks2/', filename, hue, true);
	};

	ImageManager.loadEnemy = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/enemies/', filename, hue, true);
	};

	ImageManager.loadCharacter = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/characters/', filename, hue, false);
	};

	ImageManager.loadFace = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/faces/', filename, hue, true);
	};

	ImageManager.loadParallax = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/parallaxes/', filename, hue, true);
	};

	ImageManager.loadPicture = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/pictures/', filename, hue, true);
	};

	ImageManager.loadSvActor = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/sv_actors/', filename, hue, false);
	};

	ImageManager.loadSvEnemy = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/sv_enemies/', filename, hue, true);
	};

	ImageManager.loadSystem = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/system/', filename, hue, false);
	};

	ImageManager.loadTileset = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/tilesets/', filename, hue, false);
	};

	ImageManager.loadTitle1 = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/titles1/', filename, hue, true);
	};

	ImageManager.loadTitle2 = function(filename, hue) {
		return this.loadBitmap($dataFolder + 'img/titles2/', filename, hue, true);
	};
	
	ImageManager.reserveAnimation = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/animations/', filename, hue, true, reservationId);
	};

	ImageManager.reserveBattleback1 = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/battlebacks1/', filename, hue, true, reservationId);
	};

	ImageManager.reserveBattleback2 = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/battlebacks2/', filename, hue, true, reservationId);
	};

	ImageManager.reserveEnemy = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/enemies/', filename, hue, true, reservationId);
	};

	ImageManager.reserveCharacter = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/characters/', filename, hue, false, reservationId);
	};

	ImageManager.reserveFace = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/faces/', filename, hue, true, reservationId);
	};

	ImageManager.reserveParallax = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/parallaxes/', filename, hue, true, reservationId);
	};

	ImageManager.reservePicture = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/pictures/', filename, hue, true, reservationId);
	};

	ImageManager.reserveSvActor = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/sv_actors/', filename, hue, false, reservationId);
	};

	ImageManager.reserveSvEnemy = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/sv_enemies/', filename, hue, true, reservationId);
	};

	ImageManager.reserveSystem = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/system/', filename, hue, false, reservationId || this._systemReservationId);
	};

	ImageManager.reserveTileset = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/tilesets/', filename, hue, false, reservationId);
	};

	ImageManager.reserveTitle1 = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/titles1/', filename, hue, true, reservationId);
	};

	ImageManager.reserveTitle2 = function(filename, hue, reservationId) {
		return this.reserveBitmap($dataFolder + 'img/titles2/', filename, hue, true, reservationId);
	};
	
	ImageManager.requestAnimation = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/animations/', filename, hue, true);
	};

	ImageManager.requestBattleback1 = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/battlebacks1/', filename, hue, true);
	};

	ImageManager.requestBattleback2 = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/battlebacks2/', filename, hue, true);
	};

	ImageManager.requestEnemy = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/enemies/', filename, hue, true);
	};

	ImageManager.requestCharacter = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/characters/', filename, hue, false);
	};

	ImageManager.requestFace = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/faces/', filename, hue, true);
	};

	ImageManager.requestParallax = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/parallaxes/', filename, hue, true);
	};

	ImageManager.requestPicture = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/pictures/', filename, hue, true);
	};

	ImageManager.requestSvActor = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/sv_actors/', filename, hue, false);
	};

	ImageManager.requestSvEnemy = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/sv_enemies/', filename, hue, true);
	};

	ImageManager.requestSystem = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/system/', filename, hue, false);
	};

	ImageManager.requestTileset = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/tilesets/', filename, hue, false);
	};

	ImageManager.requestTitle1 = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/titles1/', filename, hue, true);
	};

	ImageManager.requestTitle2 = function(filename, hue) {
		return this.requestBitmap($dataFolder + 'img/titles2/', filename, hue, true);
	};
	
	SceneManager.initGraphics = function() {
		var type = this.preferableRendererType();
		Graphics.initialize(this._screenWidth, this._screenHeight, type);
		Graphics.boxWidth = this._boxWidth;
		Graphics.boxHeight = this._boxHeight;
		Graphics.setLoadingImage($dataFolder + 'img/system/Loading.png');
		if (Utils.isOptionValid('showfps')) {
			Graphics.showFps();
		}
		if (type === 'webgl') {
			this.checkWebGL();
		}
	};
}