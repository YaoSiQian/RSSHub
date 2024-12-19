import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import timezone from '@/utils/timezone';
import { parseDate } from '@/utils/parse-date';
import { art } from '@/utils/render';
import path from 'node:path';

export const route: Route = {
    path: '/fj_eew',
    categories: ['forecast'],
    view: ViewType.Notifications,
    example: '/wolfx/fj_eew',
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
            source: ['api.wolfx.jp/fj_eew.json', 'ws-api.wolfx.jp/fj_eew'],
            target: '/fj_eew',
        },
    ],
    name: '福建地震局 地震预警',
    maintainers: ['YaoSiQian'],
    handler,
};

async function handler(ctx) {
    const baseUrl = 'https://api.wolfx.jp';
    const currentUrl = `${baseUrl}/fj_eew.json`;

    const { earthquake } = await ofetch(currentUrl, {
        method: "POST",
        body: { some: "json" },
    });
    /*
{
    "EventID": "20241027182139_1",
    "ReportTime": "2024-10-27 18:22:09",
    "ReportNum": 1,
    "OriginTime": "2024-10-27 18:21:43",
    "HypoCenter": "台湾花莲县附近海域",
    "Latitude": 23.92,
    "Longitude": 121.8,
    "Magunitude": 5.8,
    "isFinal": false
}
    */
    return {
        title: `${earthquake.HypoCenter}发生${earthquake.Magunitude}级地震`,
        pubDate: timezone(parseDate(earthquake.ReportTime, 'YYYY-MM-DD HH:mm:ss'), +8),
        author: '福建地震局',
        guid: earthquake.EventID,
        description: art(path.join(__dirname, 'templates/fujian.art'), {
            reportNum: earthquake.ReportNum,
            originTime: earthquake.OriginTime,
            hypoCenter: earthquake.HypoCenter,
            latitude: earthquake.Latitude,
            longitude: earthquake.Longitude,
            reportTime: earthquake.ReportTime,
        }),
    }
};