import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import timezone from '@/utils/timezone';
import { parseDate } from '@/utils/parse-date';
import { art } from '@/utils/render';
import path from 'node:path';

export const route: Route = {
    path: '/jma_eqlist',
    categories: ['forecast'],
    view: ViewType.Notifications,
    example: '/wolfx/jma_eqlist',
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
            source: ['api.wolfx.jp/jma_eqlist.json', 'ws-api.wolfx.jp/jma_eqlist'],
            target: '/jma_eqlist',
        },
    ],
    name: 'JMA 緊急地震速報',
    maintainers: ['YaoSiQian'],
    handler,
};

async function handler(ctx) {
    const baseUrl = 'https://api.wolfx.jp';
    const currentUrl = `${baseUrl}/jma_eqlist.json`;

    const { earthquake } = await ofetch(currentUrl, {
        method: "POST",
        body: { some: "json" },
    });
    /*
{
    "Title": "緊急地震速報（予報）",
    "CodeType": "Ｍ、最大予測震度及び主要動到達予測時刻の緊急地震速報",
    "Issue": {
        "Source": "東京",
        "Status": "通常"
    },
    "EventID": "20241216113409",
    "Serial": 5,
    "AnnouncedTime": "2024/12/16 11:34:51",
    "OriginTime": "2024/12/16 11:34:00",
    "Hypocenter": "種子島近海",
    "Latitude": 30,
    "Longitude": 130.5,
    "Magunitude": 4.2,
    "Depth": 50,
    "MaxIntensity": "2",
    "Accuracy": {
        "Epicenter": "IPF 法（5 点以上）",
        "Depth": "IPF 法（5 点以上）",
        "Magnitude": "全点全相"
    },
    "MaxIntChange": {
        "String": "ほとんど変化なし",
        "Reason": "不明、未設定時、キャンセル時"
    },
    "WarnArea": [],
    "isSea": true,
    "isTraining": false,
    "isAssumption": false,
    "isWarn": false,
    "isFinal": true,
    "isCancel": false,
    "OriginalText": "37 03 00 241216113451 C11 241216113400 ND20241216113409 NCN905 JD////////////// JN/// 790 N300 E1305 050 42 02 RK44529 RT10/// RC0//// 9999=",
    "Pond": "1"
}
    */
    return {
        title: `${earthquake.Hypocenter}でマグニチュード${earthquake.Magunitude}の地震`,
        pubDate: timezone(parseDate(earthquake.ReportTime, 'YYYY-MM-DD HH:mm:ss'), +9),
        author: 'JMA',
        guid: earthquake.EventID,
        description: art(path.join(__dirname, 'templates/jma_eqlist.art'), {
            title: earthquake.Title,
            originTime: earthquake.OriginTime,
            hypoCenter: earthquake.HypoCenter,
            latitude: earthquake.Latitude,
            longitude: earthquake.Longitude,
            magunitude: earthquake.Magunitude,
            depth: earthquake.Depth,
            maxIntensity: earthquake.MaxIntensity,
        }),
    }
};