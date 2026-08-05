//=============================================================================
// MKR_ControlCharacterEx.js
//=============================================================================
// Copyright (c) 2016 mankind_robo
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/07/22 一部制御文字が動作しなくなるバグを修正。
// 1.0.0 2016/07/21 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_robo/
//=============================================================================

/*:
 *
 * @plugindesc メッセージ内で使用可能な制御文字を追加します。
 * @author mankind
 *
 * @help
 * メッセージ内で利用可能な制御文字を追加します。
 * 現在追加で使用可能な制御文字は以下の通りです。
 *
 * 制御文字:
 *    \SE[SE名,SE音量,SEピッチ,SE位相]
 *      ・メッセージ表示中にSEを演奏します。
 *        SE名は必須です。拡張子を抜いたSEファイル名を
 *        指定してください。
 *
 *        音量、ピッチ、位相は数値で指定、または
 *        制御文字の\v[n](変数n番の数値)を利用可能です。
 *
 *        なお、ここでの音量、ピッチ、位相設定は
 *        プラグインパラメータで指定できる
 *        初期値設定より優先されます。
 *
 *        音量、ピッチ、位相を初期設定値のまま利用する場合は、
 *        SE名のみ指定してください。
 *        (音量のみを指定して
 *         残りを初期設定値で再生させることも可能です)
 *
 *
 *
 *
 * 制御文字の設定例:
 *   \se[CAT,20,100,0]
 *     ・猫の効果音を音量20、ピッチ100、位相0で再生します。
 *
 *   \SE[BELL1]
 *     ・ベル1の効果音を初期値設定で再生します。
 *
 *   \SE[Coin,\v[20]]
 *     ・コインの効果音を音量[変数20番]、
 *       他は初期値設定を使い再生します。
 *
 *
 * プラグインコマンド:
 *    ありません。
 *
 *
 * スクリプトコマンド:
 *    ありません。
 *
 *
 * ※ プラグインのパラメータにおいて、数値を指定するパラメータには
 *    制御文字\v[n]が使用可能です。
 *    制御文字を指定したパラメータは、パラメータの使用時に
 *    変数の値を取得するため、リアルタイムにパラメータの変更が可能です。
 *
 *
 * 利用規約:
 *    ・作者に無断で本プラグインの改変、再配布が可能です。
 *      (ただしヘッダーの著作権表示部分は残してください。)
 *
 *    ・利用形態(フリーゲーム、商用ゲーム、R-18作品等)に制限はありません。
 *      ご自由にお使いください。
 *
 *    ・本プラグインを使用したことにより発生した問題について作者は一切の責任を
 *      負いません。
 *
 *    ・要望などがある場合、本プラグインのバージョンアップを行う
 *      可能性がありますが、
 *      バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *      ご了承ください。
 *
 *
 * @param Default_SE_Volume
 * @desc [初期設定値] 制御文字でSE再生時に使われる音量です。
 * @default 90
 *
 * @param Default_SE_Pitch
 * @desc [初期設定値] 制御文字でSE再生時に使われるピッチです。
 * @default 100
 *
 * @param Default_SE_Pan
 * @desc [初期設定値] 制御文字でSE再生時に使われる位相です。
 * @default 0
 *
 * @param Default_Wait_Period
 * @desc [初期設定値] 制御文字\.利用時に待機するフレーム数です。(60フレーム=1秒)
 * @default 15
 *
 * @param Default_Wait_Line
 * @desc [初期設定値] 制御文字\|利用時に待機するフレーム数です。(60フレーム=1秒)
 * @default 60
 *
 *
 *
 * *
*/
(function () {
    'use strict';
    var Parameters, SeVolumeDef, SePitchDef, SePanDef,
        WaitPeriodDef, WaitLineDef;

    var CheckParam = function(type, param, def) {
        var regExp;

        regExp = /^\x1bV\[\d+\]$/i;
        param = param.replace(/\\/g, '\x1b');
        if(regExp.test(param)) {
            return param;
        }
        switch(type) {
            case "bool":
                return param.toUpperCase() === "ON";
            case "num":
                return (isFinite(param))? parseInt(param, 10) : (def)? def : 0;
            default:
                return param;
        }
    }

    var ConvertEscapeCharacters = function(text) {
        text = String(text);
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        return text;
    };

    Parameters = PluginManager.parameters('MKR_ControlCharacterEx');
    SeVolumeDef = CheckParam("num", Parameters['Default_SE_Volume'], 90);
    SePitchDef = CheckParam("num", Parameters['Default_SE_Pitch'], 100);
    SePanDef = CheckParam("num", Parameters['Default_SE_Pan']);
    WaitPeriodDef = CheckParam("num", Parameters['Default_Wait_Period'], 15);
    WaitLineDef = CheckParam("num", Parameters['Default_Wait_Line'], 60);

    //=========================================================================
    // Window_Base
    //  エスケープコマンドを追加定義します。
    //
    //=========================================================================

    var _Window_Base_obtainEscapeCode = Window_Base.prototype.obtainEscapeCode;
    Window_Base.prototype.obtainEscapeCode = function(textState) {
        var regExp, arr;

        textState.index++;
        regExp = /^SE\[.*?\]/i;
        arr = regExp.exec(textState.text.slice(textState.index));

        if (arr) {
            textState.index += arr[0].length;
            return arr[0];
        } else {
            textState.index--;
            return _Window_Base_obtainEscapeCode.call(this, textState);
        }
    };

    //=========================================================================
    // Window_Messge
    //  エスケープコマンドを追加定義します。
    //
    //=========================================================================

    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        var regExp, arr, res, se;
        se = {};

        regExp = /^(SE)\[(.*?)\]$/i;
        arr = regExp.exec(code);

        if (arr) {
            switch(arr[1].toUpperCase()) {
                case "SE":
                    res = arr[2].split(",");
                    se["name"] = (res[0])? res[0].trim() : "";
                    se["volume"] = (isFinite(res[1]))? parseInt(res[1],10) : ConvertEscapeCharacters(SeVolumeDef);
                    se["pitch"] = (isFinite(res[2]))? parseInt(res[2],10) : ConvertEscapeCharacters(SePitchDef);
                    se["pan"] = (isFinite(res[3]))? parseInt(res[3],10) : ConvertEscapeCharacters(SePanDef);
                    AudioManager.playSe(se);
                    break;
                default:
                    _Window_Message_processEscapeCharacter.call(this, code, textState);
            }
        } else {
            switch(code) {
                case '.':
                    this.startWait(ConvertEscapeCharacters(WaitPeriodDef));
                    break;
                case '|':
                    this.startWait(ConvertEscapeCharacters(WaitLineDef));
                    break;
                default:
                    _Window_Message_processEscapeCharacter.call(this, code, textState);
            }
        }
    };

})();