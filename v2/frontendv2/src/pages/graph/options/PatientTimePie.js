export function GetPatientTimeLinePie(data) {

    var sum = 0;
    var percents = [];

    for (let i = 0; i < data.length; i++) {
        let time = Number(data[i].times[0]);
        sum += time;
    }

    for (let i = 0; i < data.length; i++) {
        let time = Number(data[i].times[0]);
        percents.push(time / sum * 100)
    }

    var option = {

        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}%"
        },
        legend: {
            x: 'center',
            y: 'bottom',
        },
        calculable: true,
        series: [
            {
                type: 'pie',
                radius: [20, 130],
                center: ['50%', '50%'],
                roseType: 'area',
                data: [
                    { value: percents[0], name: 'Příjem pacienta' },
                    { value: percents[1], name: 'Odjezd z haly' },
                ]
            }
        ]
    };

    return option;
}

