import { saveAsJSON } from "../../../helpers/helpers";

export function GetPatientHoursAndDaysLine(data, type) {

    let d = data.slice();
    let x;

    if (type === "day") {
        d.push(d.shift())
        x = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
    }
    else {
        x = d.map(x => x.hour)
    }

    let count = d.map(x => x.count);
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
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x
        },
        yAxis: {
            type: 'value',
            name: 'Výskyt [počet]',
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        // legend: {
        //     x: 'center',
        //     y: 'bottom',
        // },
        series: [
            {
                type: 'line',
                areaStyle: {},
                data: count,
                smooth: true
            }
        ]
    };

    return option;
}

