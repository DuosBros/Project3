import { saveAsJSON, groupBy } from "../../../helpers/helpers";

export function GetLocationTimeLine(data) {
    let series = []
    var grouped = groupBy(data, "roomName")
    var keys = Object.keys(grouped);

    keys.forEach(x => {
        let p = []
        p.push(grouped[x].map(x => x.times).flat(1).reduce((a, b) => a + b))
        series.push(
            {
                name: x,
                type: 'bar',
                stack: 'a',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: p
            }
        )
    })

    var sum = series.map(x => x.data).flat(1).reduce((a, b) => a + b)

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
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: keys
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
            max: sum + 100
        },
        yAxis: {
            type: 'category'
        },
        series: series
    };

    return option;
}

