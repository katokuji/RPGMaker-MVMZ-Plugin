//=============================================================================
//     KRSF_ScreenSharpness.js
//        Version : 0.1.1
//         Author : katokuji
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Apply a sharpness filter to GameCanvas.
 * @author katokuji
 *  
 * @param useFilter
 * @text Enable/disable filter
 * @type boolean
 * @default true
 * @desc Toggle the sharpness filter on/off.
 * 
 * @param filterType
 * @text filter
 * @type select
 * @option なし(none)
 * @value none
 * @option sharpness
 * @value sharpness
 * @option unsharp mask 
 * @value unsharpmask
 * @default sharpness
 * @desc Specify the type of filter to apply to GameCanvas.
 * 
 * @param filterStrength
 * @text filter Strength
 * @type number
 * @default 50
 * @desc Specify the filter Strength on a scale of 1 to 100.
 * 
 * @help ゲーム画面全体に(GameCanvas)にシャープ効果をかけて
 * ウィンドウをリサイズした際の画像のぼやけを見た目上軽減できます
 * ただし、処理は重いです。
 * 
 * 
 * ----------------------------------------------------------------------------
 *     KRSF_ScreenSharpness.js
 * 
 * Copyright (c) 2024 katokuji
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated 
 * documentation files (the “Software”), to deal in the Software
 * without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the
 * following conditions:
 * 
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the
 * Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * ----------------------------------------------------------------------------
 * 
 * DO NOT INCLUDE MY NAME IN THE STAFF CREDITS.
 * ~~~~~~~~~~~~~~~~~~~~~~
 * 
 */

/*:ja
 * @target MV MZ
 * @plugindesc ゲーム画面（Canvas）にシャープ効果をかけて鮮明化します
 * @author katokuji
 *  
 * @param useFilter
 * @text フィルタの有効・無効
 * @type boolean
 * @default true
 * @desc シャープフィルタのON(true)・OFF(false)を指定
 * ただしフィルタ効果が"なし(none)"の場合は適用されない
 * 
 * @param filterType
 * @text フィルタ効果
 * @type select
 * @option なし(none)
 * @value none
 * @option シャープネス(sharpness)
 * @value sharpness
 * @option アンシャープマスク(unsharp mask) 
 * @value unsharpmask
 * @default sharpness
 * @desc Canvas要素に適用するシャープフィルタの種類を指定
 * 
 * @param filterStrength
 * @text フィルタ強度
 * @type number
 * @default 50
 * @desc 1～100でフィルタの強度を指定
 * 
 * @help ゲーム画面全体に(GameCanvas)にシャープ効果をかけて
 * ウィンドウをリサイズした際の画像のぼやけを見た目上軽減できます
 * 
 * 
 * ◆フィルタ効果について
 *    説明むずかしいので、目で見て確かめるのが一番良いと思います
 *    
 *    シャープネス      ： 粒度感がUP。強すぎるとざらざらする
 *    アンシャープマスク  ： ベタ感がUP。強すぎるとのっぺりする
 * 
 *    環境（ディスプレイの解像度）にもよりますが、5～15程度が適切かと。
 *    判るか判らないかの間の、若干わかんない寄りがコツです。
 *    
 *    原理上、ゲームカンバス全体に処理するので「背景だけ」「立ち絵以外」みたいな
 *    使い方はできません。
 * 
 * 
 * ◆環境
 *    WebGLが動作可能な環境であれば動作します
 *    2023年現在は特殊な環境でもない限り大丈夫だと思う
 *    負荷高めなので、快適な動作のためにはある程度のPCスペックが必要になります
 *    PCの場合、ゲーム画面(GameCanvas)の解像度ではなくウィンドウサイズに
 *    依存します。
 *    スマートフォンの場合、2020年以前のミドル以下のスマートフォンになると
 *    動作つらいかもしれません。
 *    （というかスマホサイズだと画面の変化がわからないかもしれない）
 * 
 * 
 * ◆サポートについて
 *    申し訳ありませんがノーメンテ前提です。
 *    使い方の質問などへの対応もできかねます
 *    （そもそも１～２ケ月触ってその後放置だったのでMVの使い方忘れてます……）
 *    MZ持ってないので検証できません。
 *    MZのプラグイン登録周りをコミットしてくださる方がいればマージします
 * 
 * ----------------------------------------------------------------------------
 * ◆プラグインコマンド
 * 
 *    KRSF_ScreenSharpness setFilter <filtername> <strength> <flag>
 *    
 *  フィルタのタイプと強度、有効/無効を設定します
 * 
 *  例:
 * 
 *  //シャープネスフィルタを強度10で適用する
 *  KRSF_ScreenSharpness setFilter sharpness 10 true
 * 
 *  //アンシャープネスフィルタに変更し、強度と有効フラグはそのまま
 *  KRSF_ScreenSharpness setFilter unsharpmask
 *    
 * ----------------------------------------------------------------------------
 * ◆スクリプトコマンド
 * 
 *    krsf.screenSharpness.setFilter(filter, strength, flag)
 *    
 * 
 *  フィルタのタイプと強度、有効/無効を設定します。
 * 
 *  filter '文字列'
 *     GameCanvasに適用するフィルターの種類を指定します
 *     'none'        フィルターなし
 *     'sharpness'   シャープネスフィルタを適用します
 *     'unsharpmask' アンシャープマスクを適用します
 * 
 *  strength 数値
 *     フィルタの強さを指定します
 *     通常、5～15程度が最適な値です
 *     （初期値は、ON/OFFが判りやすいように高くしてます）
 * 
 *  flag true
 *     フィルタの有効/無効フラグ、省略可
 *     falseの場合、filter:'none'と指定されます
 *     flagがtrueかつfilterが'none'以外を指定されていなければ
 *     フィルタ効果は適用されませんので、注意してください
 * 
 * 
 *  例：
 * 
 *  //シャープネス
 *  krsf.screenSharpness.setFilter('sharpness', 10, true)
 *  //現在のフィルタタイプと有効フラグを維持して、強度のみを変更
 *  krsf.screenSharpness.setFilter(, 10)
 *    
 * 
 * 
 *  krsf.screenSharpness.enableFilter(flag)
 * 
 *    有効/無効フラグを更新します。
 * 
 * ----------------------------------------------------------------------------
 * 
 * ◆更新履歴
 *   0.1.1(2024/06/08) 初版
 *
 * ----------------------------------------------------------------------------
 *     KRSF_ScreenSharpness.js
 * 
 * The MIT License
 * 
 * Copyright (c) 2024 katokuji
 *
 * 以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を
 * 取得するすべての人に対し、ソフトウェアを無制限に扱うことを無償で許可します。
 * これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または
 * 販売する権利、およびソフトウェアを提供する相手に同じことを許可する権利も無制限に含まれます。
 * 
 * 上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。
 * 
 * ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。
 * ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、
 * それに限定されるものではありません。 
 * 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、
 * あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について
 * 何らの責任も負わないものとします。
 *
 * ----------------------------------------------------------------------------
 * MITライセンスで守ることは以下の2点です。
 * 
 *    ・オリジナルの著作権表示を保持すること
 *    ・改変について明示すること
 * 
 * 著作権表示はこのプラグインファイルがpluginフォルダに入っていればOKです。
 * ただしEnigmaVirtualBoxなど外部ツールで全体を暗号化している場合は別途
 * licence.txt、readme.txt等への記載が必要です。
 * 成人向け作品の利用は大歓迎です。
 * 
 * 当プラグインの利用のみで同意なく当方の名義をスタッフロールに記載することは
 * ≪お断り≫させて頂いております。
 * 名義の記載は有償の開発案件のみに限らせて頂いておりますので、ご了承ください。
 * またこのプラグインファイルの同梱をもってクレジット表記として構いません。
 * 
 * ----------------------------------------------------------------------------
 */
 


var Imported = Imported || (Imported = {});
Imported.KRSF_ScreenSharpness = true;

var krsf = krsf || (krsf = {});
krsf.screenSharpness = krsf.screenSharpness || (krsf.screenSharpness = {});

(function(){
   "use strict";
   
   const PLUGIN_NAME = "KRSF_ScreenSharpness";
   const parameters = PluginManager.parameters(PLUGIN_NAME);

   const FILTER_STRING = {
      "none"       : "none",
      "sharpness"  : "url('#svg_sharpness')",
      "unsharpmask": "url('#svg_unsharpmask')"
   };
   
   //const p_ = Number(parameters[''] || 0);
   //const p_ = Boolean(parameters['']==='true' || false);
   const p_useFilter      = Boolean(parameters['useFilter']==='true' || false);
   const p_filterType     = String(parameters['filterType']);
   const p_filterStrength = Number(parameters['filterStrength']);

   krsf.screenSharpness._useFilter      = p_useFilter;
   krsf.screenSharpness._filterType     = p_filterType;
   krsf.screenSharpness._filterStrength = p_filterStrength;


   if(Utils.RPGMAKER_NAME == "MV"){
      const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
      Game_Interpreter.prototype.pluginCommand = function (command, args){
         _Game_Interpreter_pluginCommand.call(this, command, args);

         if (command.toLowerCase() === PLUGIN_NAME.toLowerCase()) {
            switch(args[0].toLowerCase()){
               case 'setfilter':
                  _commandSetfilter(args);
                  break;

               case 'enablefilter':
                  _commandEnablefilter(args);
                  break;
            }
         }
      };
   }

   //だが  おれは  MZを  もってない！
   if(Utils.RPGMAKER_NAME == "MZ"){
      PluginManager.registerCommand(PLUGIN_NAME, 'setfilter', function (args) {
         _commandSetfilter(args);
      });
      PluginManager.registerCommand(PLUGIN_NAME, 'enablefilter', function (args) {
         _commandEnablefilter(args);
      });
   }

   function _commandSetfilter(args){
      let arg1, arg2, arg3
      arg1 = (args[1] == '' || args[1] === undefined ) ? null : args[1];
      arg2 = (args[2] == '' || args[2] === undefined ) ? null : parseInt(args[2]);
      arg3 = (args[3] == '' || args[3] === undefined ) ? null : Boolean(args[3].toLowerCase()==='true' || false);
      
      _applySvgFilter(arg1, arg2, arg3);
   }

   function _commandEnablefilter(args){
      let arg1, arg2, arg3
      arg1 = (args[1] == '' || args[1] === undefined ) 
            ? null 
            : Boolean(args[1].toLowerCase()==='true' || false);

      _enableSvgFilter(arg1);
   }

   function _applyFilterToCanvas(filtertype){
      const canvas = document.getElementById('GameCanvas');
      const str = FILTER_STRING[filtertype] || "none";
      
      canvas.style.setProperty('filter', str);
   }
   
   //シャープネスの強度を算出
   //    k2 + k3 = 1.0
   function _calcSharpnessStrength(strength){
      const k3 = (strength/100.0).toFixed(2);
      const k2 = 1.00 - k3;

      return [k2, k3];
   }

   //アンシャープの強度を算出
   //    k2 + k3 = 1 で k2 >= 1, k3 <= 0 を満たすもの
   function _calcUnsharpStrength(strength){
      const k3 = (-1 * strength/100.0).toFixed(2);
      const k2 = 1.00 - k3;

      return [k2, k3];
   }
   

   function _applyFilterStrength(strength){
      const sharpness_compsite   = document.getElementById('svg_sharpness_compsite');
      const unsharpmask_compsite = document.getElementById('svg_unsharpmask_compsite');
      
      if (isNaN(strength)) {
         if (isNaN(krsf.screenSharpness._filterStrength)) {
            strength = p_filterStrength;
         } else {
            strength = krsf.screenSharpness._filterStrength;
         }
      }
      strength = parseInt(strength);
      
      const [s_k2, s_k3] = _calcSharpnessStrength(strength);
      sharpness_compsite.setAttribute("k2", s_k2);
      sharpness_compsite.setAttribute("k3", s_k3); 

      const [u_k2, u_k3] = _calcUnsharpStrength(strength);
      unsharpmask_compsite.setAttribute("k2", u_k2);
      unsharpmask_compsite.setAttribute("k3", u_k3);
   }
   

   //SVGフィルタの強度を設定してGameCanvasに適用する。
   //設定はkrsfオブジェクト内に保持される
   function _applySvgFilter(filtertype, strength, flag) {
      krsf.screenSharpness._filterType     = (filtertype == null) 
                                           ? krsf.screenSharpness._filterType : filtertype;

      krsf.screenSharpness._filterStrength = (strength == null) 
                                           ? krsf.screenSharpness._filterStrength : strength;
      if(flag != null){
         _enableSvgFilter(flag);
      }
      _applyFilterStrength(krsf.screenSharpness._filterStrength);
      _toggleFilterOnCanvas(krsf.screenSharpness._filterType);
   }


   function _enableSvgFilter(flag){
      krsf.screenSharpness._useFilter = flag || false;
      _toggleFilterOnCanvas(krsf.screenSharpness._filterType);
   }


//(24/06/08)kuji:
// _realScaleが0.999875とか1px未満の誤差がでるケースがあったような気がする。スクリーンサイズが小数点で誤差でるみたいなの。
// このプラグイン単体だとスクリーンサイズの近似値補正が必要かもしれない。
// Math.abs(Math.round(Graphics._realScale) - Graphics._realScale) < 0.001

   //_realScaleの更新後の値でフィルタの有効/無効の切り替えをするけど
   //Styleプロパティのfilterが更新されても、実際の反映が少し遅れることがあったような
   //たしかChromiumがDOM要素のアップデートまでfilter適用を待つせい
   function _toggleFilterOnCanvas(filterType){
      //useFilter=falseまたはrealScaleが整数倍の時フィルタを無効にする
      if(!krsf.screenSharpness._useFilter || Number.isInteger(Graphics._realScale)) {
         _applyFilterToCanvas('none');
      } else {
         _applyFilterToCanvas(filterType || krsf.screenSharpness._filterType);
      }  
   }

   //ウィンドウリサイズ時
   var _Graphics__onWindowResize = Graphics._onWindowResize;
   Graphics._onWindowResize = function(){
      _Graphics__onWindowResize.apply(this, arguments);
      _toggleFilterOnCanvas();
   };



   //SCENE_BOOTから一度、空呼びしてGameCanvas要素のstyleにSVGフィルタを適用する。
   var _Scene_Boot__prototype__start = Scene_Boot.prototype.start
   Scene_Boot.prototype.start = function(){
      _Scene_Boot__prototype__start.apply(this, arguments);
      _applySvgFilter();
   };



   //フィルタ周りの要素をドキュメントに書き込む
   function createFilterElement(){
      //コンボリューション行列でググれ。合計が1じゃないと明るくなったり暗くなったりする。
      //小数点値も可（5x5以上で整数だと値が大きくなりすぎる）
      //WEBで確認できるツールがあった http://tsudoi.org/svg/feConvolveMatrix/
      
/*
      //デフォルト
      const convolveMatrix = " 0 -1  0"
                           + "-1  5 -1"
                           + " 0 -1  0";
*/
      //斜め方向も追加して強すぎずかつ浮動小数点の端数も出ない感じの値
      const convolveMatrix = "-0.35 -0.50 -0.35"
                           + "-0.50 +4.40 -0.50"
                           + "-0.35 -0.50 -0.35";
      
      //いわゆるシャープネスの範囲。コンボリューションの縦＆横のサイズ
      const matrixOrder = "3";
      // const divisor  = "1";         //除算の分母。ここ指定すると毎回演算が入るのか重くなる
      // const edgeMode = "duplicate"  //端部の処理。これも指定すると重くなる

      //ChromiumのfeConvolveMatrixの実装だと、deplicateはかなり重いようだ
      //unsharpmaskはfeGaussianBlurを使っていてduplicateの実装も異なるので問題なし
      //feGaussianBlurの方が早いのかな？
      //ガウシアンフィルタ半径
      const stdDeviation = "3";
      const strength = parseInt(p_filterStrength);

      const [s_k2, s_k3] = _calcSharpnessStrength(strength);
      const [u_k2, u_k3] = _calcUnsharpStrength(strength);

      //Firefoxではdisplay:noneだとSVGFilterを呼び出せない。既に16年放置されてる問題……
      let hiddenStyle = (window.navigator.userAgent.indexOf('Firefox'))
                      ? "position:fixed; height:0; width:0;"
                      : "display:none";
      
      // preserveAlpha="true"を追加。アルファ部の省略。canvas要素自体は不透過なのでα値の部分は必要ない……はず？
      if(document.getElementById('krsf_svgfilter') === null) {
         document.body.insertAdjacentHTML('beforeend',
         `<svg id="krsf_svgfilter" style="${hiddenStyle}">
            <defs>
               <filter id="svg_sharpness">
                  <feConvolveMatrix result="step1"  order="${matrixOrder}" targetX="1" targetY="1" kernelMatrix="${convolveMatrix}" preserveAlpha="true"/>
                  <feComposite id="svg_sharpness_compsite" in="SourceGraphic" in2="step1" operator="arithmetic" k1="0" k2="${s_k2}" k3="${s_k3}" k4="0" />
               </filter>
               <filter id="svg_unsharpmask">
                  <feGaussianBlur result="step1" edgeMode="duplicate" stdDeviation="${stdDeviation}" />
                  <feComposite id="svg_unsharpmask_compsite" in="SourceGraphic" in2="step1" operator="arithmetic" k1="0" k2="${u_k2}" k3="${u_k3}" k4="0" />
               </filter>
            </defs>
         </svg>`);
      }
   };

   //スクリプトコマンド
   krsf.screenSharpness.setFilter    = _applySvgFilter;
   krsf.screenSharpness.enableFilter = _enableSvgFilter;

   createFilterElement();
})();
