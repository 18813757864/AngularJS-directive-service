module.service('tools', ['$http', '$filter', '$q', function($http, $filter, $q) {
      var dataStore = {};
       var tools= {
           
           setStore: function (key, data) {
                dataStore[key] = data;
            },

            getStore: function (key) {
                if(key in dataStore){
                    return dataStore[key];
                }else{
                    return null;
                }
            },

           timeTransform: function(time, long, short){
                if(time){
                    try{
                        var date=new Date(time);
                        if(date=='Invalid Date'){
                            var date=new Date(parseInt(time));
                                if(date=='Invalid Date'){
                                    var date=new Date(Date.parse(time));
                                }
                        }
                    }catch(e){
                        console.log("时间转换失败");
                        return false;
                    }
                    if(!!long){
                        return $filter("date")(date, "yyyy-MM-dd HH:mm:ss").toString();
                    }
                    if(short){
                        return $filter("date")(date, "MM-dd HH:mm").toString();
                    }else{
                        return $filter("date")(date, "yyyy-MM-dd").toString();
                    }

               }else{
                   return null;
               }
           },

           isEmptyObject: function(obj) {
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        return false;
                    }
                }
                return true;
           },

           timeValid: function(starttime, endtime, timestrap){
                if(starttime&&endtime){
                    try{
                        var start=new Date(starttime);
                        if(start=='Invalid Date'){
                            var start=new Date(parseInt(starttime));
                            if(start=='Invalid Date'){
                                var start=new Date(Date.parse(starttime));
                            }
                        }
                    }catch(e){
                        console.log("时间转换失败");
                        return false
                    }
                    try{
                        var end=new Date(endtime);
                        if(end=='Invalid Date'){
                            var end=new Date(parseInt(endtime));
                            if(end=='Invalid Date'){
                                var end=new Date(Date.parse(endtime));
                            }
                        }
                    }catch(e){
                        console.log("时间转换失败");
                        return false
                    }
                    if(start.getTime()>end.getTime()){
                        return false
                    }
                    if(timestrap) {
                        return [start.getTime(), end.getTime()];
                    } else {
                        start=$filter("date")(start, "yyyy-MM-dd HH:mm:ss").toString();
                        end=$filter("date")(end, "yyyy-MM-dd HH:mm:ss").toString();
                        return [start,end]
                    }
                }else{
                    return [null,null];
                }
            },

           divide: function (arg1,arg2){//精确除法
                  var t1=0,t2=0,r1,r2;
                  try{t1=arg1.toString().split(".")[1].length}catch(e){}
                  try{t2=arg2.toString().split(".")[1].length}catch(e){}
                  r1=Number(arg1.toString().replace(".",""))
                  r2=Number(arg2.toString().replace(".",""))
                  return (r1/r2)*Math.pow(10,t2-t1);
            },

           generateTreeData: function (data, keys, PID) {//生成树形数据结构
                /*var keys = {
                        pid: "P_CODE",
                        id: "CODE"
                };*/
                var data = angular.copy(data);
                var treeData = {$id: PID, sub: []};
                var getSub = function (source, data) {
                    for( var len = data.length, i = len-1; i >=0; i--){
                        if(source.$id == data[i][keys['pid']]){
                            var item = {};
                            for(var j in data[i]){
                                item[j] = data[i][j];
                            }
                            item.$id = data[i][keys['id']];
                            item.sub = [];
                            item.show = false;
                            source.sub.unshift(item);
                            data.splice(i, 1);
                        }
                    }
                    if(data.length == 0){
                        return;
                    }
                    for(var  k = 0, len1 = source.sub.length; k < len1; k++){
                        getSub(source.sub[k], data);
                    }
                };
                getSub(treeData, data);
                return treeData;
            },

           Validator: function(){
                 var rulesSet = {
                            isNotEmpty: function(value,errorMsg) {
                                if(value === '') {
                                    return errorMsg;
                                }
                            },
                            // 限制最小长度
                            minLength: function(value,length,errorMsg) {
                                if(value.length < length) {
                                    return errorMsg;
                                }
                            },
                            // 手机号码格式
                            mobileFormat: function(value,errorMsg) {
                                if(!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                                    return errorMsg;
                                }
                            }
                        };

                        var Validator = function(){
                            this.cache = [];  // 保存效验规则
                        };
                        Validator.prototype.add = function(value,rules) {
                            var self = this;
                            for(var i = 0, rule; rule = rules[i++]; ){
                                (function(rule){
                                    var ruleAry = rule.name.split(":");
                                    var errorMsg = rule.errorMsg;
                                    self.cache.push(function(){
                                        var ruleName = ruleAry.shift();
                                        ruleAry.unshift(value);
                                        ruleAry.push(errorMsg);
                                        return rulesSet[ruleName].apply(null,ruleAry);
                                    });
                                })(rule);
                            }
                        };
                        Validator.prototype.start = function(){
                            for(var i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
                                var msg = validatorFunc(); // 开始效验 并取得效验后的返回信息
                                if(msg) {
                                    return msg;
                                }
                            }
                        };
                        return Validator;
            },

            // $scope.menus = {
            //     theNode: {},
            //     znode: [],
            //     setting: {
            //         check : {
            //             enable: true,
            //             chkStyle: "checkbox",
            //             chkboxType: { "Y": "s", "Y": "s" }
            //         },
            //         callback: {
            //             onClick: function(event, treeId, treeNode){
            //                 treeNode.checked = !treeNode.checked;
            //                 $scope.menus.theNode.updateNode(treeNode, false);
            //                 changeNode($scope.menus.znode,treeNode.id,treeNode.checked,false);
            //             },
            //             onCheck : function (event,treeId,treeNode) {
            //                 //改变对应的数据
            //                 changeNode($scope.menus.znode,treeNode.id,treeNode.checked,true);
            //             }
            //         }
            //     }
            // };

            //ztree插件保持数据一致
           keepNodeData:function (arr,id,state,bool) {
               var changeChildrenNode = function (arr,state) {
                   angular.forEach(arr,function (item) {
                       item.checked = state;
                       if(item.children){
                           changeChildrenNode(item.children,state)
                       }
                   })
               };
               var changeNode = function (arr,id,state,bool) {
                   angular.forEach(arr,function (item) {
                       if(item.id == id){
                           item.checked = state;
                           if(bool && item.children){
                               changeChildrenNode(item.children,state)
                           }
                       }
                       if(item.children){
                           changeNode(item.children,id,state,bool)
                       }
                   });
               };
               changeNode(arr,id,state,bool);
               // return arr;
           },

            //得到ztree树插件已选名字
           getCheckedName: function (arr) {
                var name = "";
                var getName = function (arr) {
                   angular.forEach(arr,function (item) {
                       if(item.checked){
                           name = name + item.name +';';
                       }
                       if(item.children){
                           getName(item.children)
                       }
                   })
               };
               getName(arr);
               return name;
           },

            //行政区划树
           departCode: function () {
                var defer = $q.defer();
                var that = this;
                if (that.getStore('code')) {
                    defer.resolve(that.getStore('code'));

                } else {
                    $http.get("/base/indtree").success(function (data) {
                        that.setStore('code', data);
                        defer.resolve(data);

                    }).error(function () {
                        defer.reject();
                    })
                }

                return defer.promise;
            }
        };
        return tools;
  }])
