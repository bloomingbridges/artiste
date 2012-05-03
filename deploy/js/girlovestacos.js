function PxLoader($settings$$){$settings$$=$settings$$||{};if($settings$$.statusInterval==null)$settings$$.statusInterval=5E3;if($settings$$.loggingDelay==null)$settings$$.loggingDelay=2E4;if($settings$$.noProgressTimeout==null)$settings$$.noProgressTimeout=Infinity;var $entries$$=[],$progressListeners$$=[],$timeStarted$$,$progressChanged$$=+new Date,$ensureArray$$=function $$ensureArray$$$($val$$){return $val$$==null?[]:Array.isArray($val$$)?$val$$:[$val$$]};this.add=function $this$add$($resource$$){$resource$$.tags=
$ensureArray$$($resource$$.tags);if($resource$$.priority==null)$resource$$.priority=Infinity;$entries$$.push({resource:$resource$$,state:0})};this.addProgressListener=function $this$addProgressListener$($callback$$,$tags$$){$progressListeners$$.push({callback:$callback$$,tags:$ensureArray$$($tags$$)})};this.addCompletionListener=function $this$addCompletionListener$($callback$$,$tags$$){$progressListeners$$.push({tags:$ensureArray$$($tags$$),callback:function($e$$){$e$$.completedCount===$e$$.totalCount&&
$callback$$()}})};var $getResourceSort$$=function $$getResourceSort$$$($orderedTags$$){var $orderedTags$$=$ensureArray$$($orderedTags$$),$getTagOrder$$=function $$getTagOrder$$$($entry_resource$$){for(var $entry_resource$$=$entry_resource$$.resource,$bestIndex$$=Infinity,$i$$=0,$len$$=$entry_resource$$.tags.length;$i$$<$len$$;$i$$++){var $index$$=$orderedTags$$.indexOf($entry_resource$$.tags[$i$$]);$index$$>=0&&$index$$<$bestIndex$$&&($bestIndex$$=$index$$)}return $bestIndex$$};return function($a$$,
$b$$){var $aOrder$$=$getTagOrder$$($a$$),$bOrder$$=$getTagOrder$$($b$$);return $aOrder$$<$bOrder$$?-1:$aOrder$$>$bOrder$$?1:$a$$.priority<$b$$.priority?-1:$a$$.priority>$b$$.priority?1:0}};this.start=function $this$start$($compareResources_i$$2_orderedTags$$){$timeStarted$$=+new Date;$compareResources_i$$2_orderedTags$$=$getResourceSort$$($compareResources_i$$2_orderedTags$$);$entries$$.sort($compareResources_i$$2_orderedTags$$);for(var $compareResources_i$$2_orderedTags$$=0,$len$$=$entries$$.length;$compareResources_i$$2_orderedTags$$<
$len$$;$compareResources_i$$2_orderedTags$$++){var $entry$$=$entries$$[$compareResources_i$$2_orderedTags$$];$entry$$.status=1;$entry$$.resource.start(this)}setTimeout($statusCheck$$,100)};var $statusCheck$$=function $$statusCheck$$$(){for(var $checkAgain$$=!1,$noProgressTime_shouldLog$$=+new Date-$progressChanged$$,$timedOut$$=$noProgressTime_shouldLog$$>=$settings$$.noProgressTimeout,$noProgressTime_shouldLog$$=$noProgressTime_shouldLog$$>=$settings$$.loggingDelay,$i$$=0,$len$$=$entries$$.length;$i$$<
$len$$;$i$$++){var $entry$$=$entries$$[$i$$];if($entry$$.status===1&&($entry$$.resource.checkStatus(),$entry$$.status===1))if($timedOut$$)$entry$$.resource.onTimeout();else $checkAgain$$=!0}$noProgressTime_shouldLog$$&&$checkAgain$$&&$log$$();$checkAgain$$&&setTimeout($statusCheck$$,$settings$$.statusInterval)};this.isBusy=function $this$isBusy$(){for(var $i$$=0,$len$$=$entries$$.length;$i$$<$len$$;$i$$++)if($entries$$[$i$$].status===0||$entries$$[$i$$].status===1)return!0;return!1};var $arraysIntersect$$=
function $$arraysIntersect$$$($a$$,$b$$){for(var $i$$=0,$len$$=$a$$.length;$i$$<$len$$;$i$$++)if($b$$.indexOf($a$$[$i$$])>=0)return!0;return!1},$onProgress$$=function $$onProgress$$$($resource$$,$statusType$$){for(var $entry$$=null,$i$$=0,$len$$=$entries$$.length;$i$$<$len$$;$i$$++)if($entries$$[$i$$].resource===$resource$$){$entry$$=$entries$$[$i$$];break}if(!($entry$$==null||$entry$$.status!==1)){$entry$$.status=$statusType$$;$progressChanged$$=+new Date;$i$$=0;for($len$$=$progressListeners$$.length;$i$$<
$len$$;$i$$++){var $listener$$28_listener$$=$progressListeners$$[$i$$];if($listener$$28_listener$$.tags.length===0||$arraysIntersect$$($resource$$.tags,$listener$$28_listener$$.tags)){for(var $updatedEntry$$=$entry$$,$completed$$=0,$total$$=0,$i$$0$$=0,$len$$0$$=$entries$$.length;$i$$0$$<$len$$0$$;$i$$0$$++){var $entry$$0$$=$entries$$[$i$$0$$];if($listener$$28_listener$$.tags.length===0||$arraysIntersect$$($entry$$0$$.resource.tags,$listener$$28_listener$$.tags))$total$$++,($entry$$0$$.status===2||
$entry$$0$$.status===3||$entry$$0$$.status===4)&&$completed$$++}$listener$$28_listener$$.callback({resource:$updatedEntry$$.resource,loaded:$updatedEntry$$.status===2,error:$updatedEntry$$.status===3,timeout:$updatedEntry$$.status===4,completedCount:$completed$$,totalCount:$total$$})}}}};this.onLoad=function $this$onLoad$($resource$$){$onProgress$$($resource$$,2)};this.onError=function $this$onError$($resource$$){$onProgress$$($resource$$,3)};this.onTimeout=function $this$onTimeout$($resource$$){$onProgress$$($resource$$,
4)};var $log$$=this.log=function $this$log$($showAll$$){if(window.console){var $elapsedSeconds_i$$=Math.round((+new Date-$timeStarted$$)/1E3);window.console.log("PxLoader elapsed: "+$elapsedSeconds_i$$+" sec");for(var $elapsedSeconds_i$$=0,$len$$=$entries$$.length;$elapsedSeconds_i$$<$len$$;$elapsedSeconds_i$$++){var $entry$$=$entries$$[$elapsedSeconds_i$$];if($showAll$$||$entry$$.status===1){var $message$$="PxLoader: #"+$elapsedSeconds_i$$+" "+$entry$$.resource.getName();switch($entry$$.status){case 0:$message$$+=
" (Not Started)";break;case 1:$message$$+=" (Waiting)";break;case 2:$message$$+=" (Loaded)";break;case 3:$message$$+=" (Error)";break;case 4:$message$$+=" (Timeout)"}$entry$$.resource.tags.length>0&&($message$$+=" Tags: ["+$entry$$.resource.tags.join(",")+"]");window.console.log($message$$)}}}}}if(!Array.isArray)Array.isArray=function $Array$isArray$($arg$$){return Object.prototype.toString.call($arg$$)=="[object Array]"};
if(!Array.prototype.indexOf)Array.prototype.indexOf=function $Array$$indexOf$($searchElement$$){if(this==null)throw new TypeError;var $t$$=Object(this),$len$$=$t$$.length>>>0;if($len$$===0)return-1;var $k_n$$=0;arguments.length>0&&($k_n$$=Number(arguments[1]),$k_n$$!=$k_n$$?$k_n$$=0:$k_n$$!=0&&$k_n$$!=Infinity&&$k_n$$!=-Infinity&&($k_n$$=($k_n$$>0||-1)*Math.floor(Math.abs($k_n$$))));if($k_n$$>=$len$$)return-1;for($k_n$$=$k_n$$>=0?$k_n$$:Math.max($len$$-Math.abs($k_n$$),0);$k_n$$<$len$$;$k_n$$++)if($k_n$$ in
$t$$&&$t$$[$k_n$$]===$searchElement$$)return $k_n$$;return-1};function PxLoaderImage($url$$,$tags$$,$priority$$){var $self$$=this,$loader$$=null;this.img=new Image;this.tags=$tags$$;this.priority=$priority$$;var $onReadyStateChange$$=function $$onReadyStateChange$$$(){$self$$.img.readyState=="complete"&&($removeEventHandlers$$(),$loader$$.onLoad($self$$))},$onLoad$$=function $$onLoad$$$(){$removeEventHandlers$$();$loader$$.onLoad($self$$)},$onError$$=function $$onError$$$(){$removeEventHandlers$$();$loader$$.onError($self$$)},$removeEventHandlers$$=function $$removeEventHandlers$$$(){$self$$.unbind("load",
$onLoad$$);$self$$.unbind("readystatechange",$onReadyStateChange$$);$self$$.unbind("error",$onError$$)};this.start=function $this$start$($pxLoader$$){$loader$$=$pxLoader$$;$self$$.bind("load",$onLoad$$);$self$$.bind("readystatechange",$onReadyStateChange$$);$self$$.bind("error",$onError$$);$self$$.img.src=$url$$};this.checkStatus=function $this$checkStatus$(){$self$$.img.complete&&($removeEventHandlers$$(),$loader$$.onLoad($self$$))};this.onTimeout=function $this$onTimeout$(){$removeEventHandlers$$();
if($self$$.img.complete)$loader$$.onLoad($self$$);else $loader$$.onTimeout($self$$)};this.getName=function $this$getName$(){return $url$$};this.bind=function $this$bind$($eventName$$,$eventHandler$$){$self$$.img.addEventListener?$self$$.img.addEventListener($eventName$$,$eventHandler$$,!1):$self$$.img.attachEvent&&$self$$.img.attachEvent("on"+$eventName$$,$eventHandler$$)};this.unbind=function $this$unbind$($eventName$$,$eventHandler$$){$self$$.img.removeEventListener?$self$$.img.removeEventListener($eventName$$,
$eventHandler$$,!1):$self$$.img.detachEvent&&$self$$.img.detachEvent("on"+$eventName$$,$eventHandler$$)}}PxLoader.prototype.addImage=function $PxLoader$$addImage$($imageLoader_url$$,$tags$$,$priority$$){$imageLoader_url$$=new PxLoaderImage($imageLoader_url$$,$tags$$,$priority$$);this.add($imageLoader_url$$);return $imageLoader_url$$.img};function PxLoaderSound($id$$,$url$$,$tags$$,$priority$$){var $self$$=this,$loader$$=null;this.tags=$tags$$;this.priority=$priority$$;this.sound=soundManager.createSound({id:$id$$,url:$url$$,autoLoad:!1,onload:function(){$loader$$.onLoad($self$$)},onsuspend:function(){$loader$$.onTimeout($self$$)},whileloading:function(){var $bytesLoaded$$=this.bytesLoaded,$bytesTotal$$=this.bytesTotal;if($bytesLoaded$$>0&&$bytesLoaded$$===$bytesTotal$$)$loader$$.onLoad($self$$)}});this.start=function $this$start$($pxLoader$$){$loader$$=
$pxLoader$$;if(navigator.userAgent.match(/(ipad|iphone|ipod)/i))$loader$$.onTimeout($self$$);else this.sound.load()};this.checkStatus=function $this$checkStatus$(){switch($self$$.sound.readyState){case 2:$loader$$.onError($self$$);break;case 3:$loader$$.onLoad($self$$)}};this.onTimeout=function $this$onTimeout$(){$loader$$.onTimeout($self$$)};this.getName=function $this$getName$(){return $url$$}}
PxLoader.prototype.addSound=function $PxLoader$$addSound$($id$$,$url$$,$tags$$,$priority$$){$id$$=new PxLoaderSound($id$$,$url$$,$tags$$,$priority$$);this.add($id$$);return $id$$.sound};(function($h$$){function $g$$($a$$,$b$$,$c$$,$d$$,$e$$){this._listener=$b$$;this._isOnce=$c$$;this.context=$d$$;this._signal=$a$$;this._priority=$e$$||0}function $f$$($a$$,$b$$){if(typeof $a$$!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",$b$$));}var $e$$0$$={VERSION:"0.7.4"};$g$$.prototype={active:!0,params:null,execute:function $$g$$$$execute$($a$$){var $b$$;this.active&&this._listener&&($a$$=this.params?this.params.concat($a$$):$a$$,
$b$$=this._listener.apply(this.context,$a$$),this._isOnce&&this.detach());return $b$$},detach:function $$g$$$$detach$(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function $$g$$$$isBound$(){return!!this._signal&&!!this._listener},getListener:function $$g$$$$getListener$(){return this._listener},_destroy:function $$g$$$$_destroy$(){delete this._signal;delete this._listener;delete this.context},isOnce:function $$g$$$$isOnce$(){return this._isOnce},toString:function $$g$$$$toString$(){return"[SignalBinding isOnce:"+
this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}};$e$$0$$.Signal=function $$e$$0$$$Signal$(){this._bindings=[];this._prevParams=null};$e$$0$$.Signal.prototype={memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function $$e$$0$$$Signal$$_registerListener$($a$$,$b$$,$c$$,$d$$){var $e$$=this._indexOfListener($a$$,$c$$);if($e$$!==-1){if($a$$=this._bindings[$e$$],$a$$.isOnce()!==$b$$)throw Error("You cannot add"+($b$$?"":"Once")+"() then add"+(!$b$$?"":"Once")+"() the same listener without removing the relationship first.");
}else $a$$=new $g$$(this,$a$$,$b$$,$c$$,$d$$),this._addBinding($a$$);this.memorize&&this._prevParams&&$a$$.execute(this._prevParams);return $a$$},_addBinding:function $$e$$0$$$Signal$$_addBinding$($a$$){var $b$$=this._bindings.length;do--$b$$;while(this._bindings[$b$$]&&$a$$._priority<=this._bindings[$b$$]._priority);this._bindings.splice($b$$+1,0,$a$$)},_indexOfListener:function $$e$$0$$$Signal$$_indexOfListener$($a$$,$b$$){for(var $c$$=this._bindings.length,$d$$;$c$$--;)if($d$$=this._bindings[$c$$],
$d$$._listener===$a$$&&$d$$.context===$b$$)return $c$$;return-1},has:function $$e$$0$$$Signal$$has$($a$$,$b$$){return this._indexOfListener($a$$,$b$$)!==-1},add:function $$e$$0$$$Signal$$add$($a$$,$b$$,$c$$){$f$$($a$$,"add");return this._registerListener($a$$,!1,$b$$,$c$$)},addOnce:function $$e$$0$$$Signal$$addOnce$($a$$,$b$$,$c$$){$f$$($a$$,"addOnce");return this._registerListener($a$$,!0,$b$$,$c$$)},remove:function $$e$$0$$$Signal$$remove$($a$$,$b$$){$f$$($a$$,"remove");var $c$$=this._indexOfListener($a$$,
$b$$);$c$$!==-1&&(this._bindings[$c$$]._destroy(),this._bindings.splice($c$$,1));return $a$$},removeAll:function $$e$$0$$$Signal$$removeAll$(){for(var $a$$=this._bindings.length;$a$$--;)this._bindings[$a$$]._destroy();this._bindings.length=0},getNumListeners:function $$e$$0$$$Signal$$getNumListeners$(){return this._bindings.length},halt:function $$e$$0$$$Signal$$halt$(){this._shouldPropagate=!1},dispatch:function $$e$$0$$$Signal$$dispatch$($a$$){if(this.active){var $b$$=Array.prototype.slice.call(arguments),
$c$$=this._bindings.length,$d$$;if(this.memorize)this._prevParams=$b$$;if($c$$){$d$$=this._bindings.slice();this._shouldPropagate=!0;do $c$$--;while($d$$[$c$$]&&this._shouldPropagate&&$d$$[$c$$].execute($b$$)!==!1)}}},forget:function $$e$$0$$$Signal$$forget$(){this._prevParams=null},dispose:function $$e$$0$$$Signal$$dispose$(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function $$e$$0$$$Signal$$toString$(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+
"]"}};typeof define==="function"&&define.amd?define($e$$0$$):typeof module!=="undefined"&&module.exports?module.exports=$e$$0$$:$h$$.signals=$e$$0$$})(this);(function(){var $initializing$$=!1,$fnTest$$=/xyz/.test(function(){})?/\b_super\b/:/.*/;this.Class=function $this$Class$(){};Class.extend=function $Class$extend$($prop$$){function $Class$$(){!$initializing$$&&this.init&&this.init.apply(this,arguments)}var $_super$$=this.prototype;$initializing$$=!0;var $prototype$$=new this;$initializing$$=!1;for(var $name$$0$$ in $prop$$)$prototype$$[$name$$0$$]=typeof $prop$$[$name$$0$$]=="function"&&typeof $_super$$[$name$$0$$]=="function"&&$fnTest$$.test($prop$$[$name$$0$$])?
function($name$$,$fn$$){return function(){var $tmp$$=this._super;this._super=$_super$$[$name$$];var $ret$$=$fn$$.apply(this,arguments);this._super=$tmp$$;return $ret$$}}($name$$0$$,$prop$$[$name$$0$$]):$prop$$[$name$$0$$];$Class$$.prototype=$prototype$$;$Class$$.prototype.constructor=$Class$$;$Class$$.extend=arguments.callee;return $Class$$}})();(function($window$$){$window$$.Souvenirs={assets:{},sprites:{},register:function $$window$$$Souvenirs$register$($id$$,$path$$){this.assets[$id$$]=loader.addImage($path$$)},add:function $$window$$$Souvenirs$add$($id$$,$sprite$$){this.sprites[$id$$]=$sprite$$},clone:function $$window$$$Souvenirs$clone$($id$$){if($id$$ in this.sprites)return this.sprites[$id$$].clone(!0)}}})(window);
var Curator={scenes:{},currentScene:{},nextScene:{},transitioning:!1,transitionStarted:new signals.Signal,transitionEnded:new signals.Signal,sceneChanged:new signals.Signal,registerCollection:function($scenesArray$$,$autoStart$$){this.scenes=$scenesArray$$;$autoStart$$&&(this.switchTo($autoStart$$===!0?Object.keys(this.scenes).shift():$autoStart$$),Ticker.addListener(this))},tick:function(){if(this.currentSscene instanceof Scene)this.transitioning===!0?(this.currentScene.disappear(),this.nextScene.appear()):
this.transitioning==="ready"?(this.transitioning=!1,console.log("Transition finished!"),stage.removeChild(Curator.currentScene.subStage),this.currentScene=this.nextScene):this.currentScene.update()},switchTo:function($newScene$$){console.log("Switching to: "+$newScene$$);this.currentScene instanceof Scene&&this.currentScene.destroy();this.currentScene=new this.scenes[$newScene$$].scene(this.scenes[$newScene$$].blueprint)},transitionTo:function($nextScene$$){console.log("Transitioning to: "+$nextScene$$);
this.nextScene=new this.scenes[$nextScene$$].scene(this.scenes[$nextScene$$].blueprint);this.transitioning=!0},endTransition:function(){this.transitioning="ready"}},Scene=Class.extend({init:function($blueprint$$){this.subStage=new Container;stage.addChild(this.subStage);$blueprint$$&&typeof $blueprint$$==="object"?console.log("Loading scene blueprint.."):console.log("No blueprint supplied.")},update:function(){},appear:function(){},disappear:function(){},destroy:function(){stage.removeChild(this.subStage)}});var Intro=Scene.extend({init:function($blueprint$$){this._super($blueprint$$);this.gir=Souvenirs.clone("gir");this.subStage.addChild(this.gir);this.gir.x=bounds.width+90;this.gir.y=bounds.height/2;this.gir.gotoAndPlay("walk")},appear:function(){this._super()},update:function(){this.gir.x>bounds.width/2?this.gir.x-=2:Curator.switchTo("PLAY")},disappear:function(){this._super()},destroy:function(){this._super()}});var Play=Scene.extend({init:function($blueprint$$){this._super($blueprint$$);this.gir=Souvenirs.clone("gir");this.gir.x=bounds.width/2;this.gir.y=bounds.height/2;this.subStage.addChild(this.gir);this.gir.gotoAndPlay("idle");$("#stage").click(function(){$("body").removeClass("taco");$("#stage").unbind("click");Curator.transitionTo("CREDITS")});$("body").addClass("taco")},appear:function(){this._super()},update:function(){mouseInside?this.gir.currentAnimation==="idle"&&this.gir.gotoAndPlay("walk"):
this.gir.gotoAndPlay("idle")},disappear:function(){this.gir.x>-180&&(this.gir.x-=2)},destroy:function(){this._super()}});var Credits=Scene.extend({init:function($blueprint$$5_t$$){this._super($blueprint$$5_t$$);this.credits=Souvenirs.clone("credits");this.subStage.x=bounds.width;this.subStage.addChild(this.credits);this.tacoArray=[];for($blueprint$$5_t$$=0;$blueprint$$5_t$$<=9;$blueprint$$5_t$$++){var $tempTaco$$;$tempTaco$$=Souvenirs.clone("taco");$tempTaco$$.x=45+Math.random()*(bounds.width-120);$tempTaco$$.y=-100;$tempTaco$$.vY=5+Math.floor(Math.random()*5);$tempTaco$$.rotation=Math.floor(Math.random()*360);this.tacoArray.push($tempTaco$$);
this.subStage.addChild(this.tacoArray[$blueprint$$5_t$$])}},appear:function(){this.subStage.x>0?this.subStage.x-=2:($("#stage").click(function(){Tween.get(Curator.currentScene.subStage).to({y:-bounds.height,alpha:0},1E3,Ease.cubicOut).call(function(){$("#stage").unbind("click");Curator.switchTo("INTRO")})}),Curator.endTransition())},update:function(){for(var $t$$=0;$t$$<=9;$t$$++){var $tempTaco$$=this.tacoArray[$t$$];$tempTaco$$.y+=$tempTaco$$.vY;if($tempTaco$$.y>bounds.height*2)$tempTaco$$.x=45+
Math.random()*(bounds.width-120),$tempTaco$$.y=-100,$tempTaco$$.vY=5+Math.floor(Math.random()*5),$tempTaco$$.rotation=Math.floor(Math.random()*360)}},disappear:function(){this._super()},destroy:function(){this._super()}});var canvas,bounds,stage,mouseInside,loader=new PxLoader,init=function $init$(){$(canvas).attr("width",$("canvas").css("width"));$(canvas).attr("height",$("canvas").css("height"));$(canvas).mouseover(function(){mouseInside=!0});$(canvas).mouseleave(function(){mouseInside=!1});bounds=new Rectangle;bounds.width=canvas.width;bounds.height=canvas.height;stage=new Stage(canvas);assembleSprites();Curator.registerCollection({INTRO:{scene:Intro},PLAY:{scene:Play,blueprint:{}},CREDITS:{scene:Credits}},!0);
Ticker.addListener(window);Ticker.useRAF=!0;Ticker.setFPS(60)};function tick(){stage.update()}
function assembleSprites(){var $credits_gir_taco$$=new BitmapAnimation(new SpriteSheet({images:[Souvenirs.assets.girSheetImg],frames:{width:180,height:244,count:9,regX:90,regY:122},animations:{idle:[0],walk:[0,8,!0,2]}}));$credits_gir_taco$$.snapToPixel=!0;Souvenirs.add("gir",$credits_gir_taco$$);$credits_gir_taco$$=new Bitmap(Souvenirs.assets.tacoImg);$credits_gir_taco$$.regX=31;$credits_gir_taco$$.regY=50;Souvenirs.add("taco",$credits_gir_taco$$);var $credits_gir_taco$$=new Container,$shape_text$$=
new Shape,$g$$=new Graphics;$g$$.beginFill(Graphics.getRGB(176,105,199));$g$$.rect(0,0,bounds.width,bounds.height);$shape_text$$.graphics=$g$$;$credits_gir_taco$$.addChild($shape_text$$);$shape_text$$=new Text("Mmmmmm tacos!","normal 32px Helvetica","white");$shape_text$$.width=bounds.width;$shape_text$$.textAlign="center";$shape_text$$.x=bounds.width/2;$shape_text$$.y=bounds.height/2-16;$g$$=new Shadow(Graphics.getRGB(150,20,199),0,2,1);$shape_text$$.shadow=$g$$;$credits_gir_taco$$.addChild($shape_text$$);
$g$$=new Text("Click to start over","normal 16px Helvetica","white");$g$$.width=bounds.width;$g$$.textAlign="center";$g$$.x=bounds.width/2;$g$$.y=$shape_text$$.y+36;$g$$.alpha=0.9;$credits_gir_taco$$.addChild($g$$);Souvenirs.add("credits",$credits_gir_taco$$)}function preloadAssets($onComplete$$){loader.addCompletionListener(!$onComplete$$?init:$onComplete$$);loader.start()}canvas=document.getElementById("stage");
canvas.getContext("2d")?(Souvenirs.register("girSheetImg","./assets/girsheet.png"),Souvenirs.register("tacoImg","./assets/taco.png"),preloadAssets(!1)):alert("Your browser doesn't support the canvas element and I couldn't care less.");
