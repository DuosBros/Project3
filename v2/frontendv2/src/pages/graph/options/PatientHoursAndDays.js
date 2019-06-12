export function GetPatientHoursAndDaysLine(data, type) {

    let d = data.slice();
    let x;

    if(type === "day") {
        d.push(d.shift())
        x = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
    }
    else {
        x = d.map(x => x.hour)
    }

    let count = d.map(x => x.count);
    var option = {
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

