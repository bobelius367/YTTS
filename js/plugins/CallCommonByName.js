/*:

@help 
以下のプラグインコマンドを使うことで今まで、イベントコマンドでコマンドイベントを
呼び出していた時と同じように使うことができます。

１、3章以降で新しく作ったコモンイベントを呼び出したい場合
プラグインコマンドで
callのあとに半角スペースを入れてコモンイベントの名前を入力してください。

call コモンイベントの名前

をプラグインコマンドに打ち込んでください。


２、2章までで作っていたコモンイベントを呼び出したい場合
プラグインコマンドで
call2のあとに半角スペースを入れてコモンイベントの名前を入力してください。

call2 コモンイベントの名前

をプラグインコマンドに打ち込んでください。



*/
(function() {
  'use strict';// 厳格モード

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.apply(this, arguments);
    if (command === 'call' && args.length > 0) {
      this._commonEventsHash = new Object();
      if (!(args[0] in this._commonEventsHash)) {
        for (var i = $dataCommonEvents2.length - 1; i > 0; --i) {
          if ($dataCommonEvents2[i].name === args[0]) {
            this._commonEventsHash[args[0]] = i;
            break;
          } else if (i === 1) {
            throw new Error('The pluginCommand \"' + command + ' ' + args + '\" is invalid');
          }
        }
      }
      var event = $dataCommonEvents2[this._commonEventsHash[args[0]]];
      var eventId = this.isOnCurrentMap() ? this._eventId : 0;
      this.setupChild(event.list, eventId);
    }
    if (command === 'call2' && args.length > 0) {
        this._commonEventsHash = new Object();
        if (!(args[0] in this._commonEventsHash)) {
          for (var i = $dataCommonEvents.length - 1; i > 0; --i) {
            if ($dataCommonEvents[i].name === args[0]) {
              this._commonEventsHash[args[0]] = i;
              break;
            } else if (i === 1) {
              throw new Error('The pluginCommand \"' + command + ' ' + args + '\" is invalid');
            }
          }
        }
        var event = $dataCommonEvents[this._commonEventsHash[args[0]]];
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(event.list, eventId);
      }
  };

})();
