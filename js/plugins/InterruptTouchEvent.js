//=============================================================================
// InterruptTouchEvent.js
//=============================================================================
/*:
 * @plugindesc When an event touches Player, force terminates current event and invokes touch event.
 * @author Sasuke KANNAZUKI
 *
 * @help
 * Plugin Commands:
 * InterruptTouchEvent start    # start the function(default)
 * InterruptTouchEvent stop     # stop the function
 * 
 * note1:
 * - parallel event doesn't stop
 * - force stop even if message window is open.
 * - when either map is scrolling, displaying ballon icon,
 *   or animation is displaying, start touch event after the process.
 * - when you need to run the series of serialize commands, stop interruption
 *   by plugin command above, temporaly.
 * 
 * When you use 'TMFollowerEx.js' with this plugin,
 * put this plugin after 'TMFollowerEx.js'
 * if you run plugin command 'touchFollower 1',
 * command execution is intterupted even if the event touch to any followers.
 *
 */

/*:ja
 * @plugindesc プレイヤーにイベントが接触した時、現行のイベントを強制終了し接触イベントを起動します
 * @author 神無月サスケ
 *
 * @help
 * ■プラグインコマンド
 * InterruptTouchEvent start    # 割込機能を開始します（デフォルト）
 * InterruptTouchEvent stop     # 割込機能を停止します
 *
 * ■概要 
 * マップイベントやコモンイベントの実行中に、「イベントから接触」のイベントが
 * プレイヤーに接触した場合、イベントの実行を強制的に終了させ、
 * 接触したイベントを起動します。
 * 
 * ■注意
 * - 並列処理を行なっているイベントは停止しません
 * - 選択肢の表示中や入力中であっても、強制的に終了します
 * - マップのスクロール、フキダシアイコン、アニメーションの表示の実行中は、
 *  その処理が終わってから、接触イベントの実行に入ります。
 * - 途中で処理が途切れると困る一連の動作を行う場合は上記のプラグインコマンドで
 *  割り込みのON/OFFを適宜切り替えてください。
 * 
 * ひきも記さんの TMFollowerEx.js を導入すると隊列歩行するキャラと接触時にも
 * イベントを強制終了させることが可能です。
 * プラグインコマンド「touchFollower 1」を行ってください。
 * その際、このプラグインは TMFollowerEx.js の後に置いてください。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {

  //
  // define variables
  //
  var _touchFollowerIncluded = null;
  var _interruptValid = true;

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'InterruptTouchEvent') {
      switch (args[0]) {
      case 'start':
        _interruptValid = true;
        break;
      case 'stop':
        _interruptValid = false;
        break;
      }
    }
  };

  //
  // whether this is force interrupt event or not.
  //
  Game_Event.prototype.isForceInterruputEvent = function() {
    if (!_interruptValid) {
      return false;
    }
    return true;
    // もし、例えばイベントのメモに<warikomi>と書いたイベントだけ
    // 割り込ませたい場合、上記1行を以下のように書き換えてください。
    // return this.event().meta["warikomi"];
  };


 // check if Hikimoki's "TMFollowerEx.js" is included
  var touchFollowerIncluded = function() {
    if (_touchFollowerIncluded == null) {
      _touchFollowerIncluded = ("isTouchFollowerEnabled" in $gameSystem);
    }
    return _touchFollowerIncluded;
  };

  //
  // Intteruput event aborts current event execution
  //
  // (overwritten)
  Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (touchFollowerIncluded()) {
      if ($gameSystem.isTouchFollowerEnabled()) {
        if (this._trigger === 2 &&
         $gamePlayer.followers().isSomeoneCollided(x, y)) {
          if (!this.isJumping() && this.isNormalPriority()) {
            if (this.isForceInterruputEvent() && this.needsTerminate()) {
              this.forceTerminateCurrentEvent();
              var lastDirectionFix = this._directionFix;
              this._directionFix = true;
              this.start();
              this._directionFix = lastDirectionFix;
              return;
            } else if (!$gameMap.isEventRunning()) {
              var lastDirectionFix = this._directionFix;
              this._directionFix = true;
              this.start();
              this._directionFix = lastDirectionFix;
              return;
            }
          }
        }
      }
    }
    if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
      if (!this.isJumping() && this.isNormalPriority()) {
        if (this.isForceInterruputEvent() && this.needsTerminate()) {
          this.forceTerminateCurrentEvent();
          this.start();
        } else if(!$gameMap.isEventRunning()) {
          this.start();
        }
      }
    }
  };

  //
  // force termination routine
  //
  Game_Event.prototype.needsTerminate = function() {
    if (!$gameMap._interpreter.isRunning()) {
      return false;
    }
    return $gameMap._interpreter.eventId() !== this.eventId();
  };

  Game_Event.prototype.forceTerminateCurrentEvent = function() {
    if ($gameMap._interpreter.isRunning()) {
      $gameMap._interpreter.terminate();
      SceneManager._scene._messageWindow.forceTerminateMessage();
    }
    $gameMap._needsRefresh = false; // not to run autorun event.
  };

  Window_Message.prototype.forceTerminateMessage = function(doRemainMsg) {
    var needRecreate = this.needRecreateWindows();
    this.subWindows().forEach(function (window) {
      if (window instanceof Window_Selectable) {
        window.deactivate();
      }
      window.close();
      
    });
    this.terminateMessage();
    if (needRecreate) {
      SceneManager._scene.recreateMessageWindow();
    }
  };

  //
  // when message window is intterupted, recreate new ones.
  //
  Window_Message.prototype.needRecreateWindows = function () {
    return this.active && !this.isAnySubWindowActive();
  };

  Scene_Map.prototype.recreateMessageWindow = function () {
    this._messageWindow.subWindows().forEach(function(window) {
        this.removeWindow(window);
    }, this);
    this.removeWindow(this._messageWindow);
    this.createMessageWindow();
  };

  Scene_Base.prototype.removeWindow = function (window) {
    this._windowLayer.removeChild(window);
  };

  //
  // prevent always auto run
  // 
  Game_Map.prototype.isInterruptEventRunning = function () {
    var event = this.event(this._interpreter._eventId);
    if (this.isEventRunning()) {
      return true;
    } else if (event && event.isForceInterruputEvent()) {
      return true;
    }
    return false;
  };

  var _Game_Event_checkEventTriggerAuto =
   Game_Event.prototype.checkEventTriggerAuto;
  Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._trigger !== 3) {
      return;
    } else if ($gameMap.isInterruptEventRunning()){
      return;
    } else {
      _Game_Event_checkEventTriggerAuto.call(this);
    }
  };

})();
