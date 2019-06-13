import { saveAsJSON } from "../../../helpers/helpers";

export function GetLocationTimeLine(data) {

    var labels = data.map(x => x.roomName);

    var sum = 0;
    for (var i = 0; i < data.length; i++) {
        var time = Number(data[i].times[0]);
        sum += time;
    }
    let currentDate = new Date().toISOString();
    var option = {
        toolbox: {
            itemSize: 25,
            feature: {
                saveAsImage: {
                    show: true,
                    name: currentDate,
                    pixelRatio: 2,
                    title: 'Uložit',
                },
                myTool: {
                    show: true,
                    title: 'Data',
                    icon: 'M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28',
                    onclick: () => {
                        saveAsJSON(data)
                    }
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
        xAxis: {
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

