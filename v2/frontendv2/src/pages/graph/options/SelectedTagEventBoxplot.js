import {isEmpty} from '../../../helpers/helpers';

export function SelectedTagEventBoxplot(inputData) {

    if(isEmpty(inputData)) {
        return {}
    }

    var echarts = require('echarts/dist/echarts');
    var dataTool = require('echarts/dist/extension/dataTool');
    echarts.dataTool = dataTool;

    // I know, Im too lazy to write this normally
    var arr = []
    arr.push(inputData[0].times)
    var data = echarts.dataTool.prepareBoxplotData(arr)
    // var masterArr = []
    // var pica = []
    // pica.push(inputData[0].tagEventName)
    // masterArr.push(pica)
    data.axisData = inputData.map(x => x.tagEventNameStart.replace(' - ','\n-\n').replace('ø', 'ř'));

    return {

        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.axisData,
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
                show: false
            },
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                formatter: '{value}',
                showMinLabel: true,
                showMaxLabel: true,
                fontSize: 10
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: 'Čas [s]',
            splitArea: {
                show: true
            }
        },
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                data: data.boxData,
                // itemStyle: {
                //     borderColor: '#006babcf',
                //     shadowColor: '#006babcf',
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: 0, color: 'red' // color at 0% position
                //         }, {
                //             offset: 1, color: 'blue' // color at 100% position
                //         }],
                //         globalCoord: false // false by default
                //     }
                // },
                tooltip: {
                    formatter: function (param) {
                        // debugger;
                        return [
                            'Událost ' + param.name + ' [s]: ',
                            'maximum: ' + param.data[5],
                            // 'Q3: ' + param.data[4],
                            'median: ' + param.data[3],
                            // 'Q1: ' + param.data[2],
                            'minimum: ' + param.data[1]
                        ].join('<br/>');
                    }
                }
            },
            {
                name: 'Odchylka [s]',
                type: 'scatter',
                data: data.outliers
            }
        ]
    }
}