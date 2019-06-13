import { saveAsJSON } from "../../../helpers/helpers";

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

