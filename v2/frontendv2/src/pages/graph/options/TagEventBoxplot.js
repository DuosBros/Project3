import { isEmpty } from '../../../helpers/helpers';

export function GetTagEventBoxplotOption(inputData) {

    if (isEmpty(inputData)) {
        return {}
    }

    var echarts = require('../../../../node_modules/echarts/dist/echarts');
    var dataTool = require('../../../../node_modules/echarts/dist/extension/dataTool');
    echarts.dataTool = dataTool;

    var data = echarts.dataTool.prepareBoxplotData(inputData.map(x => x.times))
    data.axisData = inputData.map(x => x.tagEventNameStart.replace(' - ', '\n-\n').replace('ø', 'ř'));

    return {
        // title: [
        //     {
        //         text: 'Krabicový graf jednotlivých událostí',
        //         left: 'center',
        //     },
        //     // {
        //     //     text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
        //     //     borderColor: '#999',
        //     //     borderWidth: 1,
        //     //     textStyle: {
        //     //         fontSize: 14
        //     //     },
        //     //     left: '10%',
        //     //     top: '90%'
        //     // }
        // ],
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