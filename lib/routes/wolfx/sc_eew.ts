import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import timezone from '@/utils/timezone';
import { parseDate } from '@/utils/parse-date';
import { art } from '@/utils/render';
import path from 'node:path';

export const route: Route = {
    path: '/sc_eew',
    categories: ['forecast'],
    view: ViewType.Notifications,
    example: '/wolfx/sc_eew',
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['api.wolfx.jp/sc_eew.json', 'ws-api.wolfx.jp/sc_eew'],
            target: '/sc_eew',
        },
    ],
    name: '四川地震局 地震预警',
    maintainers: ['YaoSiQian'],
    handler,
};

async function handler(ctx) {
    const baseUrl = 'https://api.wolfx.jp';
    const currentUrl = `${baseUrl}/sc_eew.json`;

    const { earthquake } = await ofetch(currentUrl, {
        method: "POST",
        body: { some: "json" },
    });
    /*
{
    "ID": 7827,
    "EventID": "20241204235427.0001_1",
    "ReportTime": "2024-12-04 23:54:41",
    "ReportNum": 1,
    "OriginTime": "2024-12-04 23:54:27",
    "HypoCenter": "四川凉山州木里县",
    "Latitude": 28.594,
    "Longitude": 100.65,
    "Magunitude": 3.2,
    "Depth": null,
    "MaxIntensity": 5
}
    */
    return {
        title: `${earthquake.HypoCenter}发生${earthquake.Magunitude}级地震`,
        pubDate: timezone(parseDate(earthquake.ReportTime, 'YYYY-MM-DD HH:mm:ss'), +8),
        author: '四川地震局',
        guid: earthquake.EventID,
        description: art(path.join(__dirname, 'templates/sichuan.art'), {
            reportNum: earthquake.ReportNum,
            originTime: earthquake.OriginTime,
            hypoCenter: earthquake.HypoCenter,
            latitude: earthquake.Latitude,
            longitude: earthquake.Longitude,
            magunitude: earthquake.Magunitude,
            maxIntensity: earthquake.MaxIntensity,
            reportTime: earthquake.ReportTime,
        }),
    }
};