$(function(){
    module.controller("appCtl1", function ($scope) {
    $scope.aaa = {value : "hello world"};
    $scope.click = function () {
        $scope.aaa.value = Math.random();
        $scope.txt = "13233"
    };
    $scope.txt = "132"
    $scope.clickState = false;

    $scope.condition = {
        total:100,
        pageNo:1,
        pageSize:10
    }

    var config = {
        elem: '#test1', //指定元素
        type: 'date',
        range: '到',
        format: 'yyyy年M月d日'
        };

    laydate.render(config);

    $scope.bar = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
   
    $scope.fff = function(){
      console.log(111)
      $scope.bar.series[0].data = [50, 120, 136, 100, 10, 20];
      $scope.clickState = true;
      config.min = "2018-06-10"
    };

    $scope.jsonData = {
        name: 'menu',
        children: [
            {
                name: 'A',
                children: [{
                    name: 'A.1',
                    children: [{
                    name: 'A.1.1',
                    children: []
                    }]
          },{
            name: 'A.2',
            children: [{
              name: 'A.2.1',
              children: [{
                name: 'A.2.1.1',
                children: []
              }]
            },{
              name: 'A.2.2',
              children: []
            }]
          }]
        },{
          name: 'B',
          children: [{
            name: 'B.1',
            children: []
          },{
            name: 'B.2',
            children: []
          }]
        },{
          name: 'C',
          children: []
        }]
      }

       $scope.parts = {
            theNode: {},
            znodes: [],
            setting: {
                check : {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "s", "Y": "s" }
                },
                callback: {
                    onClick: function(event, treeId, treeNode){
                        treeNode.checked = !treeNode.checked;
                        $scope.menus.theNode.updateNode(treeNode, false);
                        changeNode($scope.menus.znode,treeNode.id,treeNode.checked,false);
                    },
                    onCheck : function (event,treeId,treeNode) {
                        //改变对应的数据
                        changeNode($scope.menus.znode,treeNode.id,treeNode.checked,true);
                    }
                }
            }
        };

        $scope.parts.znodes = $scope.jsonData.children;

    $scope.radioList = [
        {
            name:"a",
            des:"1"
        },{
            name:"b",
            des:"2"
        },{
            name:"c",
            des:"3"
        },{
            name:"d",
            des:"4"
        },{
            name:"e",
            des:"5"
        }
    ]

    var num = 0;
    $scope.dataStateArr = ['waiting','nodata','initing','saving','refreshing','fail','noperson','hasdata','loading']
    $scope.dataState = '';
    $scope.changeDataState = function(){
        $scope.dataState = $scope.dataStateArr[num%9];
        num++;
    }
    

})
angular.bootstrap(document, ['Demo']);
});
