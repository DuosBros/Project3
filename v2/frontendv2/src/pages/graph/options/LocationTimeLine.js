export function GetLocationTimeLine(data) {

    var labels = data.map(x => x.roomName);

    var sum = 0;
    for (var i = 0; i < data.length; i++) { 
        var time = Number(data[i].times[0]);
        sum += time;
    }
    
    var option = {
        
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: labels
        },
        grid: {
            left: '5%',
            right: '4%',
            bottom: '1%',
            containLabel: true
        },
        xAxis:  {
            type: 'value',
            nameGap: 5,
            name: 'Čas [s]',
            nameLocation: 'end',
            min: 0,
            max: sum + 1000
        },
        yAxis: {
            type: 'category',
            // data: ['1']
        },
        series: [
            {
                name: data[0].roomName,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: data[0].times
            },
            {
                name: data[1].roomName,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: data[1].times
            },
            {
                name: data[2].roomName,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: data[2].times
            },
            {
                name: data[3].roomName,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: data[3].times
            }
        ]
    };

    return option;
}

