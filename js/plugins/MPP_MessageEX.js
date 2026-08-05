//=============================================================================
// MPP_MessageEX.js
//=============================================================================
// Copyright (c) 2016 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.0】文章表示の機能を拡張したり表示の演出を追加します。
 * @author 木星ペンギン
 * @help [文章の表示]の制御文字:
 *   \sp[n]        # 文章の表示速度(秒間描写文字数n) / 0で瞬間表示
 *   \at[n]        # アニメーションタイプをn番に変更(※1)
 *   \set[n]       # 設定した文字列に変換(※2)
 *   \co[s]        # 文字列sを１文字として表示
 *   \rb[s,r]      # 文字列sにルビrを付けて表示(※3)
 *   \px[n]        # 次に表示する文字のX座標をnピクセルずらす
 *   \py[n]        # 次に表示する文字のY座標をnピクセルずらす
 *   \tx[n]        # 次に表示する文字のX座標をnに変更
 *   \ty[n]        # 次に表示する文字のY座標をnに変更
 *   \sw[n]        # スイッチn番をONにする
 *   
 *   \c[r,g,b]     # 文字色をRGBで指定
 *   \fs[n]        # 文字サイズをnに変更 / デフォルト値は28
 *   \op[n]        # 文字の不透明度(0～255) / デフォルト値は255
 *   \oc[n]        # 文字の縁の色をn番に変更 / 0でデフォルト(黒)
 *   \oc[r,g,b]    # 文字の縁の色をRGBで指定
 *   \oc[r,g,b,a]  # 文字の縁の色をRGBAで指定(※4)
 *   \ow[n]        # 文字の縁の太さを変更 / デフォルト値は4
 *   \rc[n]        # ルビの色をn番に変更 / 0でデフォルト
 *   \rc[r,g,b]    # ルビの色をRGBで指定
 *   \rs[n]        # ルビの文字サイズをnに変更
 *   \rw[n]        # ルビの縁の太さを変更 / デフォルト値は4
 *   
 *   \df           # 文章表示の設定をデフォルト値に戻す(※5)
 *   \sv           # 現在の文章表示の設定を記憶(※5)
 *   \ld           # \svで記憶した設定の呼び出し(※5)
 *
 *  以下は文章内に含まれていた場合に適用
 *   \a            # 決定キーやシフトキーによる瞬間表示の禁止
 *   \nw[s]        # 文字列sを名前ウィンドウに表示
 *   \nc[n]        # 名前ウィンドウの文字色をn番に変更
 *   \fr           # 顔グラフィックを右側に表示
 *   \fm           # 顔グラフィックを左右反転
 *   \fw[n]        # 顔グラフィックを別ウィンドウでnフレームかけて表示(※6)
 *  
 *  すべての制御文字は大文字小文字どちらでも可能
 * 
 * プラグインコマンド:
 *   SetMesRow n                  # メッセージウィンドウの表示行数をn行に変更
 *   SetMesFadeOut n s            # フェードアウトタイプをnに変更(※7)
 *                                # sで速度設定
 * 
 * プラグインコマンド(オリジナルアニメーション用):
 *   SetCharaAngle n              # 画像の回転角度をn度にする
 *   MoveCharaFrame x y w h d b   # dフレームかけて文字の表示範囲を変更
 *                                # x,y,w,hはすべて0.0～1.0で指定
 *                                # bは[完了するまでウェイト]するかどうか
 * 
 * ※1:アニメーションタイプ
 *  0:アニメーションなし
 *  1:文字が右にスライドしながら浮かび上がる
 *  2:文字が横に広がりながら表示される
 *  3:文字が拡大しながら表示される
 *  4:文字を左側から表示する(表示速度6推奨)
 *  5番以降はプラグインパラメータ(Anime Commons)で読み込むコモンイベントを指定
 *  
 * ※2:設定した文字列
 *  プラグインパラメータ(Text Set)で指定した文字列に変換
 *  制御文字も設定可能
 *  
 * ※3:ルビを振った文字列は一文字ずつではなくまとめて表示
 * 
 * ※4:アルファ値は0.0～1.0で指定
 * 
 * ※5:文章表示の設定
 *  プラグインパラメータ(Text Informations)で対象となる情報を指定
 *   0:文章の表示速度,  1:アニメーションタイプ,  2:文字色,  3:文字サイズ
 *   4:文字の不透明度,  5:文字の縁の色,  6:文字の縁の太さ,  7:ルビの色
 *   8:ルビの文字サイズ,  9:ルビの縁の太さ
 * 
 * ※6:顔グラフィックウィンドウはメッセージウィンドウの上もしくは下に表示
 *     表示にかかる時間は画面の外側から内側へ移動するまでの時間
 *  
 * ※7:フェードアウトタイプ
 *  0:なし(瞬時に消える)
 *  1:徐々に消える
 *  2:上にスクロール
 * 
 * --------------------------------
 * ●オリジナルアニメーションの作成
 *  アニメーションタイプ5番以降はコモンイベントを読み込むことで作成できます。
 *  
 *  コモンイベントに設定された[ピクチャの表示][ピクチャの移動][ピクチャの回転]
 *  [ピクチャの色調変更][ウェイト][プラグインコマンド]を読み込み、
 *  設定された数値でアニメーションが作成されます。
 *  
 *  ※注意点
 *   ・ピクチャ番号と画像名は無視されます。
 *   ・[変数で指定]は使用できません。
 *   ・[合成方法]は通常で固定されてます。
 *   ・基準となる座標はX:0,Y:0です。原点は関係ありません。
 *   ・アニメーションが終了した時点で通常の描写がされます。
 *   ・最終的な座標や拡大率、回転角度などはすべて無視されます。
 *  
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Anime Commons
 * @desc オリジナルアニメーションとして読み込むコモンイベントIDの配列
 * (カンマで区切ってください)
 *
 * @param Text Set
 * @desc 文字列のセットの配列
 * (カンマで区切ってください)
 *
 * @param Text Informations
 * @desc \df,\sv,\ldを実行した際に操作する情報
 * (カンマで区切ってください)
 * @default 0,1,2,3,4,5,6,7,8,9
 *
 * @param === Default Value ===
 * 
 * @param Default Message Row
 * @desc [メッセージウィンドウの表示行数]のデフォルト値
 * @default 4
 *
 * @param Default FadeOut Type
 * @desc [フェードアウトタイプ]のデフォルト値
 * @default 0
 *
 * @param Default FadeOut Speed
 * @desc [フェードアウト速度]のデフォルト値
 * @default 5
 *
 * @param Default Speed
 * @desc [文章の表示速度]のデフォルト値
 * @default 60
 *
 * @param Default Anime Type
 * @desc [アニメーションタイプ]のデフォルト値
 * @default 1
 *
 * @param Default Ruby Color
 * @desc [ルビの色]のデフォルト値(RGBで指定)
 * @default 255,255,255
 *
 * @param Default Ruby Size
 * @desc [ルビの文字サイズ]のデフォルト値
 * @default 14
 *
 * @param Default Ruby Outline
 * @desc [ルビの縁の太さ]のデフォルト値
 * @default 2
 *
 * @param Message Name Pos
 * @desc 名前ウィンドウの座標(メッセージウィンドウとの相対値)
 * @default 0,-56
 *
 * @param Default Name Color
 * @desc [名前ウィンドウの文字色]のデフォルト値(番号で指定)
 * @default 0
 *
 * @param Message Name Windowskin
 * @desc 名前ウィンドウのウィンドウスキン名
 * @default Window
 *
 * @param Message Face Padding
 * @desc 顔グラフィックウィンドウのX軸とY軸の余白
 * @default 0,0
 *
 * @param Message Face Windowskin
 * @desc 顔グラフィックウィンドウのウィンドウスキン名
 * @default Window
 *
 */

(function() {

var parameters = PluginManager.parameters('MPP_MessageEX');
var MPPlugin = {
    animeCommons:parameters['Anime Commons'].split(',').filter(Boolean).map(Number),
    textSet:parameters['Text Set'].split(','),
    textInformations:parameters['Text Informations'].split(',').filter(Boolean).map(Number),
    
    // === Default Value ===
    
    defaultMessageRow:Number(parameters['Default Message Row']),
    defaultFadeOutType:Number(parameters['Default FadeOut Type']),
    defaultFadeOutSpeed:Number(parameters['Default FadeOut Speed']),
    defaultSpeed:Number(parameters['Default Speed']),
    defaultAnimeType:Number(parameters['Default Anime Type']),
    defaultRubyColor:'rgb(%1)'.format(parameters['Default Ruby Color'] || '255,255,255'),
    defaultRubySize:Number(parameters['Default Ruby Size'] || 14),
    defaultRubyOutline:Number(parameters['Default Ruby Outline']),
    messageNamePos:parameters['Message Name Pos'].split(',').map(Number),
    defaultNameColor:Number(parameters['Default Name Color']),
    messageNameWindowskin:parameters['Message Name Windowskin'] || 'Window',
    messageFacePadding:parameters['Message Face Padding'].split(',').map(Number),
    messageFaceWindowskin:parameters['Message Face Windowskin'] || 'Window'
    
};

var Alias = {};

var TextAnimation = [];

//-----------------------------------------------------------------------------
// Scene_Boot

//61
Alias.ScBo_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    Alias.ScBo_start.call(this);
    this.createTextAnimation();
};

Scene_Boot.prototype.createTextAnimation = function() {
    //Type 1
    var list = [];
    list[0] = { code:0, origin:0, x:-6, y:0, sx:100, sy:100, o:0 };
    list[1] = { code:1, origin:0, x:0, y:0, sx:100, sy:100, o:255, d:6, wait:true };
    TextAnimation[1] = list;
    //Type 2
    list = [];
    list[0] = { code:0, origin:0, x:0, y:0, sx:0, sy:100, o:255 };
    list[1] = { code:1, origin:0, x:0, y:0, sx:75, sy:100, o:255, d:6, wait:true };
    list[2] = { code:1, origin:0, x:0, y:0, sx:100, sy:100, o:255, d:6, wait:true };
    TextAnimation[2] = list;
    //Type 3
    list = [];
    list[0] = { code:0, origin:1, x:0, y:0, sx:0, sy:0, o:255 };
    list[1] = { code:1, origin:1, x:0, y:0, sx:60, sy:60, o:255, d:8, wait:true };
    list[2] = { code:1, origin:1, x:0, y:0, sx:100, sy:100, o:255, d:8, wait:true };
    list[3] = { code:1, origin:1, x:0, y:0, sx:120, sy:120, o:255, d:8, wait:true };
    list[4] = { code:1, origin:1, x:0, y:0, sx:100, sy:100, o:255, d:8, wait:true };
    TextAnimation[3] = list;
    //Type 4
    list = [];
    list[0] = { code:0, origin:0, x:0, y:0, sx:100, sy:100, o:255 };
    list[1] = { code:5, x:0.0, y:0.0, w:0.0, h:1.0, d:0 };
    list[2] = { code:5, x:0.0, y:0.0, w:1.0, h:1.0, d:10, wait:true };
    TextAnimation[4] = list;
    //Original
    var commons = MPPlugin.animeCommons;
    for (var i = 0; i < commons.length; i++) {
        var common = $dataCommonEvents[commons[i]];
        if (!common) continue;
        list = [];
        common.list.forEach(function(cmd) {
            var params = cmd.parameters;
            switch (cmd.code) {
                case 230:
                    list.wait({ code:6, d:params[0] });
                    break;
                case 231:
                    list.push({ code:0, origin:params[2], x:params[4], y:params[5],
                        sx:params[6], sy:params[7], o:params[8] });
                    break;
                case 232:
                    list.push({ code:1, origin:params[2],
                        x:params[4], y:params[5], sx:params[6], sy:params[7],
                        o:params[8], d:params[10], wait:params[11] });
                    break;
                case 233:
                    list.push({ code:2, r:params[1] });
                    break;
                case 234:
                    list.push({ code:3, t:params[1], d:params[2], wait:params[3] });
                    break;
                case 356:
                    var args = params[0].split(" ");
                    var command = args.shift();
                    if (command === 'SetCharaAngle') {
                        list.push({ code:4, a:Number(args[0]) });
                    } else if (command === 'MoveCharaFrame') {
                        list.push({ code:5, x:Number(args[0]), y:Number(args[1]),
                            w:Number(args[2]), h:Number(args[3]),
                            d:Number(args[4]), wait:eval(args[5]) === true });
                    }
                    break;
            }
        });
        TextAnimation.push(list);
    }
};

//-----------------------------------------------------------------------------
// Game_Message

//11
Alias.GaMe_initialize = Game_Message.prototype.initialize;
Game_Message.prototype.initialize = function() {
    Alias.GaMe_initialize.call(this);
    this._messageRow = MPPlugin.defaultMessageRow;
    this._fadeOutType = MPPlugin.defaultFadeOutType;
    this._fadeOutSpeed = MPPlugin.defaultFadeOutSpeed;
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1722
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    if (command === 'SetMesRow') {
        $gameMessage._messageRow = Math.max(Number(args[0]), 1);
    } else if (command === 'SetMesFadeOut') {
        $gameMessage._fadeOutType = Number(args[0]);
        $gameMessage._fadeOutSpeed = Number(args[1]);
    }
};

//-----------------------------------------------------------------------------
// Sprite_TextCharacter

function Sprite_TextCharacter() {
    this.initialize.apply(this, arguments);
}

Sprite_TextCharacter.prototype = Object.create(Sprite.prototype);
Sprite_TextCharacter.prototype.constructor = Sprite_TextCharacter;

Sprite_TextCharacter.prototype.initialize = function(bitmap, x, y, rect, list) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = bitmap;
    this._baseX = x;
    this._baseY = y;
    this._rect = rect;
    this._list = list;
    this._index = -1;
    this._waitCount = 0;
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.initFrame();
    this.update();
};

Sprite_TextCharacter.prototype.initBasic = function() {
    this._origin = 0;
    this._offsetX = 0;
    this._offsetY = 0;
};

Sprite_TextCharacter.prototype.initTarget = function() {
    this._targetX = this._baseX;
    this._targetY = this._baseY;
    this._targetScaleX = 1;
    this._targetScaleY = 1;
    this._targetOpacity = 255;
    this._moveDuration = 0;
};

Sprite_TextCharacter.prototype.initTone = function() {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};

Sprite_TextCharacter.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
};

Sprite_TextCharacter.prototype.initFrame = function() {
    var bitmap = this._bitmap;
    if (bitmap) {
        this.setFrame(0, 0, bitmap.width, bitmap.height);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
    this._frame2 = null;
    this._frame2Target = null;
    this._frame2Duration = 0;
};

Sprite_TextCharacter.prototype.isPlaying = function() {
    return !!this._list;
};

Sprite_TextCharacter.prototype.drawX = function() {
    return this._baseX - this._rect.x;
};

Sprite_TextCharacter.prototype.drawY = function() {
    return this._baseY - this._rect.y;
};

Sprite_TextCharacter.prototype.show = function(cmd) {
    this._origin = cmd.origin;
    this._offsetX = cmd.x;
    this._offsetY = cmd.y;
    this.scale.x = cmd.sx / 100;
    this.scale.y = cmd.sy / 100;
    this.opacity = cmd.o;
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.initFrame();
};

Sprite_TextCharacter.prototype.move = function(cmd) {
    this._origin = cmd.origin;
    this._targetX = cmd.x;
    this._targetY = cmd.y;
    this._targetScaleX = cmd.sx / 100;
    this._targetScaleY = cmd.sy / 100;
    this._targetOpacity = cmd.o;
    this._moveDuration = cmd.d;
    if (cmd.wait) this.wait(this._moveDuration);
};

Sprite_TextCharacter.prototype.rotate = function(cmd) {
    this._rotationSpeed = cmd.r;
};

Sprite_TextCharacter.prototype.tint = function(cmd) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = cmd.t.clone();
    this._toneDuration = cmd.d;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
        this.setColorTone(this._tone);
    }
    if (cmd.wait) this.wait(this._toneDuration);
};

Sprite_TextCharacter.prototype.frame = function(cmd) {
    if (!this._frame2) {
        this._frame2 = [0, 0, 1, 1];
    }
    this._frame2Target = [cmd.x, cmd.y, cmd.w, cmd.h];
    this._frame2Duration = cmd.d;
    if (this._frame2Duration === 0) {
        this._frame2 = this._frame2Target.clone();
        this.setFrame2();
    }
    if (cmd.wait) this.wait(this._frame2Duration);
};

Sprite_TextCharacter.prototype.wait = function(count) {
    this._waitCount = count;
};

Sprite_TextCharacter.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this.isPlaying() || !this.updateCommand()) return;
    this.updateMove();
    this.updateTone();
    this.updateRotation();
    this.updateFrame();
};

Sprite_TextCharacter.prototype.updateCommand = function() {
    for (;;) {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        this._index++;
        var cmd = this._list[this._index];
        if (cmd) {
            switch (cmd.code) {
                case 0:
                    this.show(cmd);
                    break;
                case 1:
                    this.move(cmd);
                    break;
                case 2:
                    this.rotate(cmd);
                    break;
                case 3:
                    this.tint(cmd);
                    break;
                case 4:
                    this._angle = cmd.a;
                    break;
                case 5:
                    this.frame(cmd);
                    break;
                case 6:
                    this.wait(cmd.d);
                    break;
            }
        } else {
            this._list = null;
            this.visible = false;
            return false;
        }
    }
};

Sprite_TextCharacter.prototype.updateMove = function() {
    if (this._moveDuration > 0) {
        var d = this._moveDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetY) / d;
        this.scale.x  = (this.scale.x  * (d - 1) + this._targetScaleX)  / d;
        this.scale.y  = (this.scale.y  * (d - 1) + this._targetScaleY)  / d;
        this.opacity  = (this.opacity  * (d - 1) + this._targetOpacity) / d;
        this._moveDuration--;
    }
    this.x = this._baseX + this._offsetX;
    this.y = this._baseY + this._offsetY;
    if (this._origin === 1) {
        this.x += this._rect.width / 2;
        this.y += this._rect.height / 2;
    }
};

Sprite_TextCharacter.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
    if (this._tone) this.setColorTone(this._tone);
};

Sprite_TextCharacter.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
    this.rotation = this._angle * Math.PI / 180;
};

Sprite_TextCharacter.prototype.updateFrame = function() {
    if (this._frame2Duration > 0) {
        var d = this._frame2Duration;
        for (var i = 0; i < 4; i++) {
            this._frame2[i] = (this._frame2[i] * (d - 1) + this._frame2Target[i]) / d;
        }
        this._frame2Duration--;
    }
    this.setFrame2();
};

Sprite_TextCharacter.prototype.setFrame2 = function() {
    if (this.bitmap && this._frame2) {
        var bw = this.bitmap.width;
        var bh = this.bitmap.height;
        var fx = Math.floor(bw * this._frame2[0]);
        var fy = Math.floor(bh * this._frame2[1]);
        var fw = Math.ceil(bw * this._frame2[2]);
        var fh = Math.ceil(bh * this._frame2[3]);
        this.setFrame(fx, fy, fw, fh);
    }
    var ox = this._rect.x;
    var oy = this._rect.y;
    if (this._origin === 1) {
        ox += this._rect.width / 2;
        oy += this._rect.height / 2;
    }
    this.anchor.x = ox / this.width;
    this.anchor.y = oy / this.height;
};

//-----------------------------------------------------------------------------
// Window_Message

//13
Alias.WiMe_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function() {
    this._messageRow = $gameMessage._messageRow;
    this._textInfo = [];
    this._rubyBitmap = new Bitmap();
    Alias.WiMe_initialize.call(this);
    this._characterSprite = new Sprite();
    this._characterSprite.x = this.standardPadding();
    this._characterSprite.y = this.standardPadding();
    this.addChild(this._characterSprite);
};

Alias.WiMe_resetFontSettings = Window_Message.prototype.resetFontSettings;
Window_Message.prototype.resetFontSettings = function() {
    Alias.WiMe_resetFontSettings.call(this);
    this.contents.paintOpacity = 255;
    this._paintOpacity = 255;
    this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
    this.contents.outlineWidth = 4;
    this._rubyBitmap.textColor = MPPlugin.defaultRubyColor;
    this._rubyBitmap.fontSize = MPPlugin.defaultRubySize;
    this._rubyBitmap.outlineWidth = MPPlugin.defaultRubyOutline;
};

//24
Alias.WiMe_initMembers = Window_Message.prototype.initMembers;
Window_Message.prototype.initMembers = function() {
    Alias.WiMe_initMembers.call(this);
    this.clearFlags2();
};

//33
Alias.WiMe_subWindows = Window_Message.prototype.subWindows;
Window_Message.prototype.subWindows = function() {
    return Alias.WiMe_subWindows.call(this).concat(this._nameWindow);
};

//38
Alias.WiMe_createSubWindows = Window_Message.prototype.createSubWindows;
Window_Message.prototype.createSubWindows = function() {
    Alias.WiMe_createSubWindows.call(this);
    this._faceWindow = new Window_MessageFace(this);
    this._nameWindow = new Window_MessageName(this);
    this.addChild(this._faceWindow);
};

//55
Alias.WiMe_clearFlags = Window_Message.prototype.clearFlags;
Window_Message.prototype.clearFlags = function() {
    Alias.WiMe_clearFlags.call(this);
    this._speed = MPPlugin.defaultSpeed;
    this._animeType = MPPlugin.defaultAnimeType;
    this._fadeOutType = 0;
    this._fadeOutSpeed = 0;
    this._lastBottomY = 0;
    this._messageCount = 0;
};

Window_Message.prototype.clearFlags2 = function() {
    this._auto = false;
    this._faceDuration = -1;
    this._faceRight = false;
    this._faceMirror = false;
    this._name = null;
    this._nameColorIndex = 0;
};

//61
Window_Message.prototype.numVisibleRows = function() {
    return this._messageRow;
};

//65
Alias.WiMe_update = Window_Message.prototype.update;
Window_Message.prototype.update = function() {
    Alias.WiMe_update.call(this);
    var sprites = this._characterSprite.children.clone();
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (this._showFast || !sprite.isPlaying()) {
            var bitmap = sprite.bitmap;
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height,
                sprite.drawX(), sprite.drawY());
            this._characterSprite.removeChild(sprite);
        }
    }
};

Alias.WiMe_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
Window_Message.prototype.convertEscapeCharacters = function(text) {
    text = Alias.WiMe_convertEscapeCharacters.call(this, text);
    text = text.replace(/\x1bSET\[(\d+)\]/gi, function() {
        var setText = MPPlugin.textSet[parseInt(arguments[1])];
        return Alias.WiMe_convertEscapeCharacters.call(this, setText);
    }.bind(this));
    text = text.replace(/\x1bA[^T]/gi, function() {
        this._auto = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bFW\[(\d+)\]/gi, function() {
        this._faceDuration = parseInt(arguments[1]);
        return '';
    }.bind(this));
    text = text.replace(/\x1bFR/gi, function() {
        this._faceRight = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bFM/gi, function() {
        this._faceMirror = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bNW\[([^\]]+)\]/gi, function() {
        this._name = arguments[1];
        return '';
    }.bind(this));
    text = text.replace(/\x1bNC\[(\d+)\]/gi, function() {
        this._nameColorIndex = parseInt(arguments[1]);
        return '';
    }.bind(this));
    return text;
};

//98
Alias.WiMe_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
    this.clearFlags2();
    this._messageRow = $gameMessage._messageRow;
    this.height = this.windowHeight();
    this.createContents();
    Alias.WiMe_startMessage.call(this);
    if (this._name) this._nameWindow.setName(this._name, this._nameColorIndex);
};

//119
Alias.WiMe_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function(close) {
    if (close || !$gameMessage._fadeOutType || !$gameMessage._fadeOutSpeed) {
        Alias.WiMe_terminateMessage.call(this);
        this._faceWindow.visible = false;
        this._nameWindow.close();
    } else {
        this._fadeOutType = $gameMessage._fadeOutType;
        this._fadeOutSpeed = $gameMessage._fadeOutSpeed;
    }
};

//171
Alias.WiMe_updateMessage = Window_Message.prototype.updateMessage;
Window_Message.prototype.updateMessage = function() {
    if (this.updateFadeOut()) {
        return true;
    }
    if (this._textState) {
        this.updateShowFast();
        this._messageCount += this._speed;
        while (this._messageCount >= 60 || this._speed === 0) {
            if (Alias.WiMe_updateMessage.call(this)) {
                this._messageCount = Math.max(this._messageCount - 60, 0);
            } else {
                break;
            }
        }
        return true;
    } else {
        return this._characterSprite.children.length > 0;
    }
};

Window_Message.prototype.updateFadeOut = function() {
    if (this._fadeOutType > 0) {
        var finish = true;
        switch (this._fadeOutType) {
            case 1:
                this.contentsOpacity -= this._fadeOutSpeed;
                finish = (this.contentsOpacity === 0);
                break;
            case 2:
                this.origin.y += this._fadeOutSpeed;
                finish = (this.origin.y >= this._lastBottomY);
                break;
        }
        if (finish) {
            this._fadeOutType = 0;
            this.terminateMessage(true);
        }
        return true;
    } else {
        return false;
    }
};

//231
Alias.WiMe_areSettingsChanged = Window_Message.prototype.areSettingsChanged;
Window_Message.prototype.areSettingsChanged = function() {
    return (Alias.WiMe_areSettingsChanged.call(this) ||
            this._messageRow !== $gameMessage._messageRow);
};

//236
Alias.WiMe_updateShowFast = Window_Message.prototype.updateShowFast;
Window_Message.prototype.updateShowFast = function() {
    if (!this._auto) Alias.WiMe_updateShowFast.call(this);
};

//242
Alias.WiMe_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function(textState) {
    var sprites = this._characterSprite.children.clone();
    for (var i = 0; i < sprites.length; i++) {
        this._characterSprite.removeChild(sprites[i]);
    }
    Alias.WiMe_newPage.call(this, textState);
    this.contentsOpacity = 255;
    this.origin.y = 0;
    this._faceWindow.visible = false;
    textState.rubyHeight = this.calcRubyHeight(textState);
    textState.y += textState.rubyHeight;
    this._lastBottomY = textState.y + textState.height;
};

Window_Message.prototype.calcRubyHeight = function(textState) {
    var rubyHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    
    var rubySize = this._rubyBitmap.fontSize;
    var regExp1 = /\x1bRS\[(\d+)\]/gi;
    var regExp2 = /\x1bRB\[[^\]]+\]/gi;
    for (;;) {
        var array1 = regExp1.exec(lines[0]);
        var array2 = regExp2.exec(lines[0]);
        if (array1) {
            rubySize = parseInt(array1[1]);
        } else if (array2 && rubyHeight < rubySize) {
            rubyHeight = rubySize;
        } else {
            break;
        }
    }
    
    return rubyHeight;
};

//257
Window_Message.prototype.drawMessageFace = function() {
    this._faceWindow.setFace($gameMessage.faceName(), $gameMessage.faceIndex());
};

//261
Alias.WiMe_newLineX = Window_Message.prototype.newLineX;
Window_Message.prototype.newLineX = function() {
    if (this._faceRight || this._faceDuration > 0) {
        return 0;
    } else {
        return Alias.WiMe_newLineX.call(this);
    }
};

Alias.WiMe_processCharacter = Window_Message.prototype.processCharacter;
Window_Message.prototype.processCharacter = function(textState) {
    Alias.WiMe_processCharacter.call(this, textState);
    this._lastBottomY = textState.y + textState.height;
};

//265
Alias.WiMe_processNewLine = Window_Message.prototype.processNewLine;
Window_Message.prototype.processNewLine = function(textState) {
    Alias.WiMe_processNewLine.call(this, textState);
    textState.rubyHeight = this.calcRubyHeight(textState);
    textState.y += textState.rubyHeight;
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};

//291
Alias.WiMe_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'SP':
        this._speed = this.obtainEscapeParam(textState);
        break;
    case 'AT':
        this._animeType = this.obtainEscapeParam(textState);
        break;
    case 'CO':
        this.processGroupCharacter(textState, this.obtainEscapeTexts(textState));
        break;
    case 'RB':
        this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
        break;
    case 'PX':
        textState.x += this.obtainEscapeParam2(textState);
        break;
    case 'PY':
        textState.y += this.obtainEscapeParam2(textState);
        break;
    case 'TX':
        textState.x = this.obtainEscapeParam(textState);
        break;
    case 'TY':
        textState.y = this.obtainEscapeParam(textState);
        break;
    case 'SW':
        $gameSwitches.setValue(this.obtainEscapeParam(textState), true);
        break;
    case 'C':
        this.contents.textColor = this.obtainEscapeColor(textState);
        break;
    case 'FS':
        this.contents.fontSize = this.obtainEscapeParam(textState);
        break;
    case 'OP':
        this._paintOpacity = this.obtainEscapeParam(textState);
        break;
    case 'OC':
        this.contents.outlineColor = this.obtainEscapeColor(textState, 'rgba(0,0,0,0.5)');
        break;
    case 'OW':
        this.contents.outlineWidth = this.obtainEscapeParam(textState);
        break;
    case 'RC':
        this._rubyBitmap.textColor = this.obtainEscapeColor(textState, MPPlugin.defaultRubyColor);
        break;
    case 'RS':
        this._rubyBitmap.fontSize = this.obtainEscapeParam(textState);
        break;
    case 'RW':
        this._rubyBitmap.outlineWidth = this.obtainEscapeParam(textState);
        break;
    case 'DF':
        this.defaultTextInfo();
        break;
    case 'SV':
        this.saveTextInfo();
        break;
    case 'LD':
        this.loadTextInfo();
        break;
    default:
        Alias.WiMe_processEscapeCharacter.call(this, code, textState);
        break;
    }
};

Window_Message.prototype.obtainEscapeParam2 = function(textState) {
    var arr = /^\[-?\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};

Window_Message.prototype.obtainEscapeTexts = function(textState) {
    var arr = /^\[([^\]]+)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[1].split(',');
    } else {
        return [];
    }
};

Window_Message.prototype.obtainEscapeColor = function(textState, defaultColor) {
    defaultColor = defaultColor || this.textColor(0);
    var arr = /^\[([\d\s,.]+)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        switch (arr[1].split(',').length) {
            case 1:
                var n = parseInt(arr[1]);
                return (n === 0 ? defaultColor : this.textColor(n));
            case 3:
                return 'rgb(%1)'.format(arr[1]);
            case 4:
                return 'rgba(%1)'.format(arr[1]);
        }
    }
    return '';
};

Window_Message.prototype.defaultTextInfo = function() {
    var informations = MPPlugin.textInformations;
    if (informations.contains(0)) this._speed = MPPlugin.defaultSpeed;
    if (informations.contains(1)) this._animeType = MPPlugin.defaultAnimeType;
    if (informations.contains(2)) this.resetTextColor();
    if (informations.contains(3)) this.contents.fontSize = this.standardFontSize();
    if (informations.contains(4)) this._paintOpacity = 255;
    if (informations.contains(5)) this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
    if (informations.contains(6)) this.contents.outlineWidth = 4;
    if (informations.contains(7)) this._rubyBitmap.textColor = MPPlugin.defaultRubyColor;
    if (informations.contains(8)) this._rubyBitmap.fontSize = MPPlugin.defaultRubySize;
    if (informations.contains(9)) this._rubyBitmap.outlineWidth = MPPlugin.defaultRubyOutline;
};

Window_Message.prototype.saveTextInfo = function() {
    var informations = MPPlugin.textInformations;
    if (informations.contains(0)) this._textInfo[0] = this._speed;
    if (informations.contains(1)) this._textInfo[1] = this._animeType;
    if (informations.contains(2)) this._textInfo[2] = this.contents.textColor;
    if (informations.contains(3)) this._textInfo[3] = this.contents.fontSize;
    if (informations.contains(4)) this._textInfo[4] = this._paintOpacity;
    if (informations.contains(5)) this._textInfo[5] = this.contents.outlineColor;
    if (informations.contains(6)) this._textInfo[6] = this.contents.outlineWidth;
    if (informations.contains(7)) this._textInfo[7] = this._rubyBitmap.textColor;
    if (informations.contains(8)) this._textInfo[8] = this._rubyBitmap.fontSize;
    if (informations.contains(9)) this._textInfo[9] = this._rubyBitmap.outlineWidth;
};

Window_Message.prototype.loadTextInfo = function() {
    if (this._textInfo.length === 0) return;
    var informations = MPPlugin.textInformations;
    if (informations.contains(0)) this._speed = this._textInfo[0];
    if (informations.contains(1)) this._animeType = this._textInfo[1];
    if (informations.contains(2)) this.contents.textColor = this._textInfo[2];
    if (informations.contains(3)) this.contents.fontSize = this._textInfo[3];
    if (informations.contains(4)) this._paintOpacity = this._textInfo[4];
    if (informations.contains(5)) this.contents.outlineColor = this._textInfo[5];
    if (informations.contains(6)) this.contents.outlineWidth = this._textInfo[6];
    if (informations.contains(7)) this._rubyBitmap.textColor = this._textInfo[7];
    if (informations.contains(8)) this._rubyBitmap.fontSize = this._textInfo[8];
    if (informations.contains(9)) this._rubyBitmap.outlineWidth = this._textInfo[9];

};

Alias.WiMe_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
Window_Message.prototype.processNormalCharacter = function(textState) {
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        Alias.WiMe_processNormalCharacter.call(this, textState);
        this.contents.paintOpacity = 255;
    } else {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);
        var h = textState.height;
        var bitmap = this.createCharacterBitmap(w + 8, h);
        bitmap.drawText(c, 4, 0, w * 2, h);
        var x = textState.x;
        var y = textState.y;
        var rect = new Rectangle(4, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
        textState.x += w;
    }
};

Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
    var x = textState.x + 2;
    var y = textState.y + (textState.height - Window_Base._iconHeight) / 2;
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.drawIcon(iconIndex, x, y);
        this.contents.paintOpacity = 255;
    } else {
        var w = Window_Base._iconWidth + 8
        var h = Window_Base._iconHeight + 8;
        var bitmap = this.createCharacterBitmap(w, h);
        
        var icons = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        bitmap.blt(icons, sx, sy, pw, ph, 0, 0);
        
        var rect = new Rectangle(0, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += Window_Base._iconWidth + 4;
};

Window_Message.prototype.processGroupCharacter = function(textState, texts) {
    var x = textState.x;
    var y = textState.y;
    var c = texts[0];
    var w = this.textWidth(c);
    var h = textState.height;
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.contents.drawText(c, x, y, w * 2, h);
        this.contents.paintOpacity = 255;
    } else {
        var bitmap = this.createCharacterBitmap(w + 8, h);
        bitmap.drawText(c, 4, 0, w * 2, h);
        var rect = new Rectangle(4, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += w;
};

Window_Message.prototype.processRubyCharacter = function(textState, texts) {
    var x = textState.x;
    var y = textState.y;
    var c = texts[0];
    var w = this.textWidth(c);
    var h = textState.height;
    var r = texts[1];
    var rw = this._rubyBitmap.measureTextWidth(r);
    var rh = textState.rubyHeight;
    this._rubyBitmap.clear();
    this._rubyBitmap.resize(rw + 8, rh + 8);
    this._rubyBitmap.drawText(r, 4, 0, rw + 8, rh + 8);
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.contents.drawText(c, x, y, w * 2, h);
        var rx = x + (w - rw) / 2;
        var ry = y - (rh + 4);
        this.contents.blt(this._rubyBitmap, 0, 0, rw + 8, rh + 8, rx, ry);
        this.contents.paintOpacity = 255;
    } else {
        var bitmap = this.createCharacterBitmap(Math.max(w + 8, rw + 8), h + rh);
        var dx = (bitmap.width - w) / 2;
        bitmap.drawText(c, dx, rh + 4, w * 2, h);
        var rx = (bitmap.width - (rw + 8)) / 2;
        bitmap.blt(this._rubyBitmap, 0, 0, rw + 8, rh + 8, rx, 0);
        var rect = new Rectangle(dx, rh + 4, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += w;
};

Window_Message.prototype.createCharacterBitmap = function(w, h) {
    var bitmap = new Bitmap(w, h);
    bitmap.fontFace = this.contents.fontFace;
    bitmap.fontSize = this.contents.fontSize;
    bitmap.textColor = this.contents.textColor;
    bitmap.paintOpacity = this._paintOpacity;
    bitmap.outlineColor = this.contents.outlineColor;
    bitmap.outlineWidth = this.contents.outlineWidth;
    return bitmap;
};

Alias.WiMe_calcTextHeight = Window_Message.prototype.calcTextHeight;
Window_Message.prototype.calcTextHeight = function(textState, all) {
    var line = textState.text.slice(textState.index).split('\n')[0];

    var maxFontSize = this.contents.fontSize;
    var regExp = /\x1bFS\[(\d+)\]/gi;
    for (;;) {
        var array = regExp.exec(line);
        if (array) {
            var fontSize = parseInt(array[1]);
            if (maxFontSize < fontSize) {
                maxFontSize = fontSize;
            }
        } else {
            break;
        }
    }

    return Math.max(Alias.WiMe_calcTextHeight.call(this, textState, all), maxFontSize + 8);
};

//-----------------------------------------------------------------------------
// Window_MessageFace

function Window_MessageFace() {
    this.initialize.apply(this, arguments);
}

Window_MessageFace.prototype = Object.create(Window_Base.prototype);
Window_MessageFace.prototype.constructor = Window_MessageFace;

Window_MessageFace.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    var width = Window_Base._faceWidth + this.standardPadding() * 2;
    var height = Window_Base._faceHeight + this.standardPadding() * 2;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.visible = false;
    this._moveX = 0;
    this._moveDuration = 0;
};

Window_MessageFace.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem(MPPlugin.messageFaceWindowskin);
};

Window_MessageFace.prototype.setFace = function(faceName, faceIndex) {
    var background = $gameMessage.background();
    var positionType = $gameMessage.positionType();
    var window = this._messageWindow;
    var right = window._faceRight;
    var mirror = window._faceMirror;
    var duration = window._faceDuration;
    var mh = window.contentsHeight();
    var fw = Window_Base._faceWidth;
    var fh = Math.min(mh, Window_Base._faceHeight);
    this.contents.clear();
    this.drawFace(faceName, faceIndex, 0, 0, fw, fh);
    if (duration < 0) {
        this.x = right ? window.width - this.width : 0;
        this.y = (mh - fh) / 2;
        this.setBackgroundType(2);
    } else {
        this.x = right ? window.width : -this.width;
        var xp = MPPlugin.messageFacePadding[0];
        this._moveX = right ? window.width - this.width - xp : xp;
        this._moveDuration = duration;
        if (this._moveDuration === 0) this.x = this._moveX;
        var yp = MPPlugin.messageFacePadding[1];
        this.y = (positionType === 0 ? window.height + yp : -this.height - yp);
        this.setBackgroundType(background);
    }
    
    this._windowContentsSprite.anchor.x = mirror ? 1 : 0;
    this._windowContentsSprite.scale.x = mirror ? -1 : 1;
    
    this.visible = true;
};

Window_MessageFace.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._moveDuration > 0) {
        var d = this._moveDuration;
        this.x = (this.x * (d - 1) + this._moveX) / d;
        this._moveDuration--;
    }
};

//-----------------------------------------------------------------------------
// Window_MessageName

function Window_MessageName() {
    this.initialize.apply(this, arguments);
}

Window_MessageName.prototype = Object.create(Window_Base.prototype);
Window_MessageName.prototype.constructor = Window_MessageName;

Window_MessageName.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Base.prototype.initialize.call(this, 0, 0, 0, this.fittingHeight(1));
    this.openness = 0;
    this._name = null;
    this._needOpen = false;
};

Window_MessageName.prototype.standardPadding = function() {
    return 10;
};

Window_MessageName.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem(MPPlugin.messageNameWindowskin);
};

Window_MessageName.prototype.setName = function(name, colorIndex) {
    if (this._name !== name) {
        this._name = name;
        var width = this.textWidth(name) + this.textPadding() * 2;
        this.width = width + this.standardPadding() * 2;
        this.x = this._messageWindow.x + MPPlugin.messageNamePos[0];
        this.y = this._messageWindow.y + MPPlugin.messageNamePos[1];
        this.createContents();
        this.resetFontSettings();
        this.changeTextColor(this.textColor(colorIndex));
        this.drawText(name, this.textPadding(), 0, width);
        this._needOpen = true;
    } else if (name) {
        this.open();
    }
};

Window_MessageName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._needOpen && this.isClosed()) {
        this.open();
        this._needOpen = false;
    }
};

})();
