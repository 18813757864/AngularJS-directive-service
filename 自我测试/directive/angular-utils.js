/**
 * echarts 必须给宽度和高度
 * ------------------------------------------------------------------
 */
app.directive("dirEcharts",['$timeout', function ($timeout) {
       return {
            restrict:"EA",
            scope:{
                options:"="
            },
            link: function(scope, element, attrs){
                var chart, timer;
                var chartId = attrs.echartsDirective ? attrs.echartsDirective : 'autoId';

                scope.$watch('options',function(n,o){
                    if(scope.options){
                        if(!chart){
                            init();
                        }else{
                            chart.setOption(scope.options);
                        }
                    }
                },true);

                function dispose(){
                    if(chart){
                        chart.dispose();
                        $(window).unbind('resize', chartId);
                    }
                }

                function init(){
                    dispose();
                    //安全检测，未显示却加载则不init
                    if($(element).width()){
                        chart = echarts.init(element[0], 'macarons'); 
                        chart.showLoading({
                            text:'正在努力读取数据中...'
                        });
                        //为echart对象加载数据
                        chart.setOption(scope.options);
                        chart.hideLoading();
                        $(window).bind('resize', function () {
                            chart.resize();//监测图表自适应  
                        
                        });


                        //监控饼图扇形切换选中状态的事件
                        chart.on('pieselectchanged', function (params) {
                            scope.$emit("pieselectchanged", params);
                        });
                        chart.on('click', function (params) {
                            scope.$emit("barClick", params);
                        });
                        chart.on('brushSelected', function (params) {
                            scope.$emit("brushSelected", params);
                        });

                    }
                }

                if(timer){
                    $timeout.cancel(timer);
                }
               
                timer = $timeout(init,0);

                scope.$on('$destroy',function(){
                    dispose();
                })
                
              
            }
       }
    }])

    //用input type=text 代替type=number
    .directive("dirValidNumber", [function () {
        return {
            require: '?ngModel',
            restrict: 'EA',
            link: function(scope, element, attrs, c){

              scope.$watch(attrs.ngModel, function(n,o){

                var validateStr = n;

                if(validateStr == "" || validateStr == null){
                  c.$setValidity('number',true);
                  return;
                }
                var result = validateStr.replace(/\D/g,"")
                element.val(result)
                if(result != null){
                  c.$setValidity('number',true);
                }else{
                  c.$setValidity('number',false);
                }
                
              });
            }
        }
    }])

    //拖拽 选择拖拽的元素加enablemove 触发拖拽的元素加data-move="true"
    .directive("dirEnablemove", [function () {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs){
                var move = {
                    oldX:"",
                    oldY:"",
                    left:"",
                    top:"",
                    ele:element.context,
                };
                var that = move.ele;

                function mousemoveHandler(evt){    
                    evt.preventDefault(); //消除移动时鼠标选中文本
                    var dx = parseInt(evt.clientX - move.oldX);  //  获取到元素距离上一次元素左边框的距离 
                    var dy = parseInt(evt.clientY - move.oldY);  //  获取到元素距离上一次元素上边框的距离
                    that.style.left = (move.left + dx) + 'px';
                    that.style.top = (move.top + dy) + 'px';
                }

                function mouseupHandler(evt){
                    document.body.removeEventListener('mousemove',mousemoveHandler);
                    document.body.removeEventListener('mouseup',mouseupHandler);
                }

                if(that){
                    that.onmousedown = function(evt){
                        move.oldX = evt.clientX;
                        move.oldY = evt.clientY;
                        if(that.currentStyle){
                            move.left = angular.element(that).position().left;
                            move.top = angular.element(that).position().top;
                        }else{
                            var divStyle = document.defaultView.getComputedStyle(that, null);
                            move.left = parseInt(divStyle.left);
                            move.top = parseInt(divStyle.top);
                        }
                        if(evt.srcElement.dataset.move){//触发拖拽
                            document.body.addEventListener('mousemove', mousemoveHandler);
                            document.body.addEventListener('mouseup', mouseupHandler);
                        }
                    }
                }
            }
        }
    }])

    //加载数据请求 cgs-data-state state='dataState'
    .directive('dirDataState', [function () {
        return {
            restrict: 'A',
            scope: {
                state: '='
            },
            link: function (scope, ele, attrs) {
                var state;
                var html = [
                    '<span style="color: #007dff;"><i class="fa fa-spinner fa-spin fa-lg" ></i>正在查询<span>',
                    '<span style="color: #ff4800;"><i class="fa fa-exclamation-circle fa-lg"></i>查无数据</span>',
                    '<span style="color: #64bf65;"><i class="fa fa-spinner fa-spin fa-lg"></i>正在初始化</span>',
                    '<span style="color: #007dff;"><i class="fa fa-spinner fa-spin fa-lg"></i>正在保存</span>',
                    '<span style="color: #007dff;"><i class="fa fa-spinner fa-spin fa-lg"></i>正在刷新</span>',
                    '<span style="color: #ff0000;"><i class="fa fa-exclamation-triangle"></i>查询数据失败</span>',
                    '<span style="color: #ff4800;"><i class="fa fa-exclamation-circle fa-lg"></i>查无人员</span>',
                    '<span style="color: #007dff;"><i class="fa fa-spinner fa-spin fa-lg"></i>正在加载</span>',
                ]
                var parentEle = ele.context.querySelector('.dataState');
                if (!parentEle) {
                    parentEle = document.createElement('div');
                    parentEle.id = 'dataState';
                    parentEle.style.zIndex = 2;
                    parentEle.style.textAlign = 'center';
                    if (attrs.setPosition == 'fixed') {
                        parentEle.style.position = 'fixed';
                        parentEle.style.top = '50%';
                        parentEle.style.left = '50%';
                    } else {
                        parentEle.style.position = 'absolute';
                        parentEle.style.top = '0';
                        parentEle.style.left = '0';
                        parentEle.style.width = '100%';
                        parentEle.style.height = '100%';
                        parentEle.style.paddingTop = '20%';
                    }
                    if (attrs.cgsDataState == "true") { //屏蔽内容
                        parentEle.style.background = '#fff';
                    }
                    if (!attrs.notSetPosition) {
                        ele.context.style.position = 'relative';
                    }
                    ele.context.appendChild(parentEle);
                }
                var watcher = scope.$watch('state', function () {
                    if (scope.state) {
                        state = scope.state;
                        switch (state) {
                            case "waiting":
                                parentEle.innerHTML = html[0];
                                parentEle.style.display = 'block';
                                break;
                            case "nodata":
                                parentEle.innerHTML = html[1];
                                parentEle.style.display = 'block';
                                break;
                            case "initing":
                                parentEle.innerHTML = html[2];
                                parentEle.style.display = 'block';
                                break;
                            case "saving":
                                parentEle.innerHTML = html[3];
                                parentEle.style.display = 'block';
                                break;
                            case "refreshing":
                                parentEle.innerHTML = html[4];
                                parentEle.style.display = 'block';
                                break;
                            case "fail":
                                parentEle.innerHTML = html[5];
                                parentEle.style.display = 'block';
                                break;
                            case "noperson":
                                parentEle.innerHTML = html[6];
                                parentEle.style.display = 'block';
                                break;
                            case "hasdata":
                                parentEle.innerHTML = null;
                                parentEle.style.display = 'none';
                                break;
                            case "loading":
                                parentEle.innerHTML = html[7];
                                parentEle.style.display = 'block';
                                break;
                        }
                    } else {
                        parentEle.innerHTML = null;
                        parentEle.style.display = 'none';
                    }
                }, true)
                scope.$on("$destroy", function () {
                    watcher();
                });
            }
        }
    }])

    //点击按钮更改按钮状态
    .directive("clickWaiting", [function() {
		return {
			restrict: 'A',
			scope: {
				waiting: '='
			},
			link: function(scope, ele, attr) {
				var originalHtml = ele.html();
				var watcher = scope.$watch('waiting', function(n, o) {
	            	if (n) {
	            		ele.html('<i class="fa fa-spin fa-spinner"></i>');
	            	} else if (o != undefined) {
	            		ele.html(originalHtml);
	            	}
	            });
				
				scope.$on('$destroy', function() {
					watcher();
				});
			}
		}
    }])
    
    //查询数据加载状态 load-sign load-state='dateState' true false
    .directive("loadSign", ['$compile', function($compile) { 
		return {
	        restrict: 'A',
	        scope: {
	            loadState: '='
	        },
	        link: function (scope, ele, attrs) {
	        	var v = checkIEVersion();
	        	if (v && v <= 9) {
	        		var html = '<img src="images/globalUse/loading.gif">';        		
	        	} else {
	        		var html = '<div ng-include="\'directive/loading.html\'" style="width: 50px;"></div>'; 
	        	}       	
	            var parentEle = document.createElement('div');
	            parentEle.style.zIndex = 2;
	            if (attrs.setPosition == 'fixed') {
	                parentEle.style.position = 'fixed';
	                parentEle.style.top = '50%';
	                parentEle.style.left = '50%';
	            } else {
	                parentEle.style.position = attrs.setPosition || 'absolute';
	                parentEle.style.top = 'calc(50% - 50px)';
	                parentEle.style.left = 'calc(50% - 50px)';
	            }
	            parentEle.innerHTML = html;
	            $compile(parentEle)(scope);
	            (ele.context || ele[0]).style.position = 'relative';
	            (ele.context || ele[0]).appendChild(parentEle);
	            var watcher = scope.$watch('loadState', function(state) {
	            	if (!state) {
	            		parentEle.style.display = 'none';
	            	} else {
	            		parentEle.style.display = 'block';
	            	}
	            });
	            
	            scope.$on('$destroy', function() {
					watcher();
				});

	            function checkIEVersion() {
					if(!!window.ActiveXObject || "ActiveXObject" in window){
						var ua = navigator.userAgent.toLowerCase();
				        var s;
				        var str;
				        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? str = s[1] :((s = ua.match(/msie ([\d.]+)/)) ? str = s[1]:"12");
						str = parseFloat(str).toFixed(0);
				        return str;			
					}
					return false;
				}
	        }
	    }
    }])
    
    //滚动条 支持Chrome FireFox Opera IE6+ 
    .directive('dirSlim', [function () {
        return {
            restrict: 'AC',
            scope: {
                options: '='
            },
            link: function (scope, element, attrs) {
                var options;
                if (scope.options) {
                    options = scope.options;
                } else options = {
                    height: '490px',
                    size: '7px'
                };
                $(element).slimscroll(options);
            }
        }
    }])

    //datePicker97 必须要有ng-model 
    .directive('dirDatePicker', function(dateFilter) {
        return{
            require : '?ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                if(typeof WdatePicker == 'function' && ngModel) {
                    var options = {};
                    options.dateFmt = attrs.dateFmt?attrs.dateFmt: 'yyyy-MM-dd HH:mm:ss';
                    scope.$watch(attrs.minDate, function(n, o){//设定可选的最小日期
                        options.minDate = dateFilter(n, options.dateFmt);
                    });
                    scope.$watch(attrs.maxDate, function(n, o){//设定可选的最大日期
                        options.maxDate = dateFilter(n, options.dateFmt);
                    });
                    options.onpicked = function(dp) {
                        var object = dp.cal.newdate;
                        var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                        ngModel.$setViewValue(date);
                    };

                  options.Hchanged = function (dp) {
                      var object = dp.cal.newdate;
                      var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                      if (!!ngModel)
                          ngModel.$setViewValue(date);
                  };
                  options.mchanged = function (dp) {
                      var object = dp.cal.newdate;
                      var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                      if (!!ngModel)
                          ngModel.$setViewValue(date);
                  };
                  
                    options.oncleared = function(dp) {
                        ngModel.$setViewValue(null);
                    };
                    scope.$watch(attrs.ngModel, function(n, o) {
                        element.val(dateFilter(n, options.dateFmt));
                    });
                    var wdateFun = function() {
                        WdatePicker(options);
                    };
                    element.focus(wdateFun);
                    element.click(wdateFun);
                }
            }
        }
    })

    //树插件 dir-tree z-nodes="regionTree.allNodes" z-settings="regionTree.settings" 插件数据和controller数据不是保持一致，修改后需要回调保持一致
    .directive('dirTree', function ($http) {
        return {
            require: '^ngModel',
            restrict: 'A',
            scope: {
                zNodes: '=',
                zSettings: '='
            },
            link: function (scope, element, attrs, ngModel) {
                function initTree() {
                    if (!!scope.zNodes && !!scope.zSettings) {
                        var zObj = $.fn.zTree.init(element, scope.zSettings, scope.zNodes);
                        var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                        if(scope.zSettings.expandAll) zTreeObj.expandAll(true);
                        if (!!ngModel) {
                            ngModel.$setViewValue(zObj);
                        }
                    }
                }
                scope.$watch('zNodes', function (o, n) {
                    initTree();
                });
                scope.$watch('zSettings', function (o, n) {
                    initTree();
                })
                scope.$on('$destroy', function () {
                    var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                    if (!!zTreeObj) {
                        zTreeObj.destroy();
                    }
                });
            }
        };
    })
   